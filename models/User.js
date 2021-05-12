'use strict';

/* Dependencies and files */
const Mongoose = require('mongoose');
const cipher = require('../helpers/encryption');

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
    shows: [{ type: Mongoose.Schema.Types.ObjectId, ref: 'Show' }],
    posts: [{ type: Mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    isActive: { type: Boolean, default: true },
    addedBy: { type: Mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    createdAt: { type: Date, default: Date.now },
    modifiedAt: { type: Date, default: Date.now },
});

/**
 * @Middleware
 */
userSchema.pre('save', async function(next) {
    let fields = Object.keys(this.profile);
    for (const prop of fields) {
        if(prop === 'password')
            this.profile[prop] = await cipher.hashPassword(this.profile[prop]);
        else
            this.profile[prop] = cipher.encrypt(this.profile[prop]);
    }
    return;
})

/* Producer model schema */
const User = Mongoose.model('User', userSchema);


/* Insert a new producer in the database */
exports.insertUser = async data => {
    /* Defaults for bio, avatar & role */
    data.bio = data.bio || 'Another StudioFM1 105.4 producer';
    data.avatar = data.avatar || ''; // Add a default avatar

    /* Create Producer instance */
    const newUser = new User({ profile: data });
    /* Insert new producer */
    await newUser.save();
};
