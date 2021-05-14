'use strict';

/* Dependencies and files */
const Mongoose = require('mongoose');
const cipher = require('../helpers/encryption');
const { getRandomGidi } = require('../helpers/avatars');
const errorMsg = require('../messages/errors.json');

/* Producer Schema */
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
 * @Middleware
 */
userSchema.pre('save', async function () {
    const fields = Object.keys(this.profile);
    for (const prop of fields) {
        if(prop === '$init') continue;
        if (this.isModified(`profile.${prop}`)) {
            if (prop === 'password') this.profile[prop] = await cipher.hashPassword(this.profile[prop]);
            else this.profile[prop] = cipher.encrypt(this.profile[prop]);
        }
    }
    return;
});

/* Validate producer's password methoid */
userSchema.methods.validatePassword = function (password) {
    return cipher.comparePassword(password, this.profile.password);
};

/* Producer model schema */
const User = Mongoose.model('User', userSchema);

/* Insert a new user in the database */
exports.insertUser = async data => {
    /* Defaults for bio, avatar & role */
    data.bio = data.bio || 'Another StudioFM1 105.4 producer';
    data.avatar = await getRandomGidi();
    const newUser = new User({ profile: data });
    await newUser.save();
};

/* Validate user's login */
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

/* Get user's profile data */
exports.getUserData = async id => {
    /* Get user without password*/
    const user = await User.findById(id);

    /* Decrypt data */
    const fields = Object.keys(user.profile);
    for (const prop of fields) {
        if (prop === '$init' || prop === 'password') continue;
        user.profile[prop] = cipher.decrypt(user.profile[prop]);
    }

    return { _id: user._id, ...user.profile, ...user.status, shows: user.shows };
};

/* Update user's data */
exports.updateUserData = async (id, data) => {
    /* Get user and assign changed properties */
    const user = await User.findById(id);

    /* If there is a new password */
    if (data.newPassword.length) {
        /* Validate current password before proceeding */
        const validated = await user.validatePassword(data.password);
        if (!validated) throw { msgs: [{ msg: errorMsg.INVALID_CURRENT_PASSWORD, field: 'password' }], status: 401 };

        /* Format object before assigning to the User instance */
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
