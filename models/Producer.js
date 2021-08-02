'use strict';

const Mongoose = require('mongoose');
const cipher = require('../helpers/encryption');
const { getRandomGidi } = require('../helpers/images');
const errorMsg = require('../messages/errors.json');

/**
 * The Producer model schema
 */
const producerSchema = new Mongoose.Schema({
    profile: {
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        username: { type: String, unique: true, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        mobilePhone: { type: String, required: true },
        role: { type: String, required: true },
        avatar: { type: String },
        bio: { type: String },
    },
    status: {
        isActive: { type: Boolean, default: true },
        isVisible: { type: Boolean, default: false },
        isVerified: { type: Boolean, default: false },
    },
    shows: [{ type: Mongoose.Schema.Types.ObjectId, ref: 'Show' }],
    posts: [{ type: Mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    addedBy: { type: Mongoose.Schema.Types.ObjectId, ref: 'Producer', default: null },
    createdAt: { type: Date, default: Date.now },
    modifiedAt: { type: Date, default: Date.now },
});

/**
 * Middleware function that encrypts
 * producer profile data before saving
 */
producerSchema.pre('save', async function (next) {
    const fields = Object.keys(this.profile);
    for (const prop of fields) {
        if (prop === '$init') continue;
        if (this.isModified(`profile.${prop}`)) {
            if (prop === 'password') this.profile[prop] = await cipher.hashPassword(this.profile[prop]);
            else this.profile[prop] = cipher.encrypt(this.profile[prop]);
        }
    }
    next();
});

/**
 * Validate's producer's password
 * returns true or false
 */
producerSchema.methods.validatePassword = function (password) {
    return cipher.comparePassword(password, this.profile.password);
};

/* Producer model schema */
const Producer = Mongoose.model('Producer', producerSchema);

/**
 * Inserts a new producer in the database
 */
exports.insertProducer = async data => {
    /* Defaults for bio, avatar & role */
    data.bio = data.bio || 'Another StudioFM1 105.4 producer';
    data.password = data.password || Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 6);
    data.avatar = await getRandomGidi();

    const newProducer = new Producer({ profile: data });
    await newProducer.save();
};

/**
 * Validate's producer's try to login
 * returns returns an object with the producer's id and username
 */
exports.validateLogin = async ({ email, password }) => {
    const producer = await Producer.findOne({ 'profile.email': cipher.encrypt(email) });

    if (!producer)
        throw {
            msgs: [
                { msg: errorMsg.CREDENTIALS_ERROR, field: 'email' },
                { msg: errorMsg.CREDENTIALS_ERROR, field: 'password' },
            ],
            status: 401,
        };

    const validated = await producer.validatePassword(password);
    if (!validated)
        throw {
            msgs: [
                { msg: errorMsg.CREDENTIALS_ERROR, field: 'email' },
                { msg: errorMsg.CREDENTIALS_ERROR, field: 'password' },
            ],
            status: 401,
        };

    return { producerId: producer._id, username: cipher.decrypt(producer.profile.username) };
};

/**
 * Get all producers from the databas
 */
exports.getProducers = async () => {
    const producers = await Producer.find();

    producers.forEach(producer => {
        /* Decrypt data */
        const fields = Object.keys(producer.profile);
        for (const prop of fields) {
            if (prop === '$init' || prop === 'password') continue;
            producer.profile[prop] = cipher.decrypt(producer.profile[prop]);
        }
    });

    producers.sort((a, b) => a.profile.lastName.localeCompare(b.profile.lastName)); // Sort by lastname

    return producers;
};

/**
 * Finds a producer in the database
 * and return it's data
 * returns the producer that corresponds to that id
 */
exports.getProducerData = async id => {
    const producer = await Producer.findById(id);

    /* Decrypt data */
    const fields = Object.keys(producer.profile);
    for (const prop of fields) {
        if (prop === '$init' || prop === 'password') continue;
        producer.profile[prop] = cipher.decrypt(producer.profile[prop]);
    }

    return { _id: producer._id, ...producer.profile, ...producer.status, shows: producer.shows };
};

/**
 * Finds a producer in the database
 * and updates its data
 * returns the updated producer that corresponds to that ID
 */
exports.updateProducerData = async (id, data) => {
    const producer = await Producer.findById(id);

    /* If there is a new password */
    if (data.newPassword.length) {
        const validated = await producer.validatePassword(data.password);
        if (!validated) throw { msgs: [{ msg: errorMsg.INVALID_CURRENT_PASSWORD, field: 'password' }], status: 401 };

        data.password = data.newPassword;
        delete data.newPassword;
    } else {
        /* If no new password, delete any reference of the object to passwords */
        delete data.password;
        delete data.newPassword;
    }

    Object.assign(producer.profile, data);
    await producer.save();

    return { producerId: producer._id, username: cipher.decrypt(producer.profile.username) };
};

/**
 * Updates the producer's avatar
 */
exports.updateProducerAvatar = async (id, fileName) => {
    let producer = await Producer.findById(id);
    if (producer) {
        producer.profile.avatar = `/images/avatars/${fileName}`;
        await producer.save();
    }
};

/**
 * Update the producer's status
 */
exports.updateProducerStatus = async (id, data) => {
    const producer = await Producer.findById(id);
    Object.assign(producer.status, data);
    await producer.save();
    return { _id: producer._id, status: producer.status };
};
