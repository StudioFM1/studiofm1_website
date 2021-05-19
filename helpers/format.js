'use strict'

const errorMsgs = require('../messages/errors.json');

/**
 * Sort the users array
 * according to the given template
 */
exports.sortUsers = (users, template = 'role') => {
    let sortedusers = {};

    if(template === 'active') {
        sortedusers = {
            active: users.filter(user => user.status.isActive),
            inactive: users.filter(user => !user.status.isActive),
        }
    } else if(template === 'verified') {
        sortedusers = {
            verified: users.filter(user => user.status.isVerified),
            unverified: users.filter(user => !user.status.isVerified),
        }
    } else {
        sortedusers = {
            admins: users.filter(user => user.profile.role === 'admin'),
            editors: users.filter(user => user.profile.role === 'editor'),
            authors: users.filter(user => user.profile.role === 'author'),
            basics: users.filter(user => user.profile.role === 'basic')
        }
    }

    return sortedusers;
}

/**
 * Formats the error so that it can 
 * be interpretated from the client
 * returns formatted error object
 */
exports.clientError = err => {
    console.log(err);
    if (err.constructor.name === 'MongoError') {
        if (err.code === 11000) {
            // Duplicate key error
            let duplicate = Object.keys(err.keyPattern)[0];
            if (duplicate === 'profile.email') return { msgs: [{ msg: errorMsgs.EMAIL_EXISTS, field: 'email' }], status: 409 };
            else if (duplicate === 'profile.username') return { msgs: [{ msg: errorMsgs.USERNAME_EXISTS, field: 'username' }], status: 409 };
        }
    } else if (err.constructor.name === 'MulterError') {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return { msgs: [{ msg: errorMsgs.IMAGE_TOO_LARGE }], status: 400 };
        }
    } else {
        return { msgs: [{ msg: errorMsgs.UNEXPECTED_ERROR }], status: 500 };
    }
};
