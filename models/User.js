'use strict';

const Mongoose = require('mongoose');
const cipher = require('../helpers/encryption');
const { getRandomGidi } = require('../helpers/images');
const errorMsg = require('../messages/errors.json');

/**
 * @description: The User model schema
 */
const userSchema = new Mongoose.Schema({
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
    addedBy: { type: Mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    createdAt: { type: Date, default: Date.now },
    modifiedAt: { type: Date, default: Date.now },
});

/**
 * Middleware function that encrypts 
 * user profile data before saving
 * 
 * @param {function} next The next() function to move on save
 */
userSchema.pre('save', async function (next) {
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
 * Validate's user's password
 * 
 * @param {string} password The password to be validated 
 * @returns true or false
 */
userSchema.methods.validatePassword = function (password) {
    return cipher.comparePassword(password, this.profile.password);
};

/* Producer model schema */
const User = Mongoose.model('User', userSchema);

/**
 * Inserts a new user in the database
 * 
 * @param {object} data the user's data
 * 
 */
exports.insertUser = async data => {
    /* Defaults for bio, avatar & role */
    data.bio = data.bio || 'Another StudioFM1 105.4 producer';
    data.avatar = await getRandomGidi();

    const newUser = new User({ profile: data });
    await newUser.save();
};

/**
 * Validate's user's try to login
 * 
 * @param {string} email The email of the user 
 * @param {string} password The password of the user 
 * @returns returns an object with the user's id and username
 */
exports.validateLogin = async ({ email, password }) => {
    const user = await User.findOne({ 'profile.email': cipher.encrypt(email) });

    if (!user)
        throw {
            msgs: [
                { msg: errorMsg.CREDENTIALS_ERROR, field: 'email' },
                { msg: errorMsg.CREDENTIALS_ERROR, field: 'password' },
            ],
            status: 401,
        };

    const validated = await user.validatePassword(password);
    if (!validated)
        throw {
            msgs: [
                { msg: errorMsg.CREDENTIALS_ERROR, field: 'email' },
                { msg: errorMsg.CREDENTIALS_ERROR, field: 'password' },
            ],
            status: 401,
        };

    return { userId: user._id, username: cipher.decrypt(user.profile.username) };
};

/**
 * Finds a user in the database 
 * and return it's data
 * 
 * @param {string} id the Mongoose object ID 
 * @returns the user that corresponds to that id
 */
exports.getUserData = async id => {
    const user = await User.findById(id);

    /* Decrypt data */
    const fields = Object.keys(user.profile);
    for (const prop of fields) {
        if (prop === '$init' || prop === 'password') continue;
        user.profile[prop] = cipher.decrypt(user.profile[prop]);
    }

    return { _id: user._id, ...user.profile, ...user.status, shows: user.shows };
};

/**
 * Finds a user in the database 
 * and updates its data
 * 
 * @param {string} id the Mongoose object ID 
 * @param {object} data the new data
 * @returns the updated user that corresponds to that ID
 */
exports.updateUserData = async (id, data) => {
    const user = await User.findById(id);

    /* If there is a new password */
    if (data.newPassword.length) {
        const validated = await user.validatePassword(data.password);
        if (!validated) throw { msgs: [{ msg: errorMsg.INVALID_CURRENT_PASSWORD, field: 'password' }], status: 401 };

        data.password = data.newPassword;
        delete data.newPassword;
    } else {
        /* If no new password, delete any reference of the object to passwords */
        delete data.password;
        delete data.newPassword;
    }

    Object.assign(user.profile, data);
    await user.save();

    return { _id: user._id, ...user.profile, ...user.status, shows: user.shows };
};
