'use strict'

const errorMsgs = require('../messages/errors.json');

/**
 * Formats the error so that it can 
 * be interpretated from the client
 * 
 * @param {object} err 
 * @returns formatted error object
 */
exports.clientError = err => {
    console.log(err, 6437);
    if (err.constructor.name === 'MongoError') {
        if (err.code === 11000) { // Duplicate key error
            let duplicate = Object.keys(err.keyPattern)[0];
            if(duplicate === 'profile.email')
                return { msgs: [{ msg: errorMsgs.EMAIL_EXISTS, field: 'email' }], status: 409 };
            else if (duplicate === 'profile.username')
                return { msgs: [{ msg: errorMsgs.USERNAME_EXISTS, field: 'username' }], status: 409 };
        }
    } else {
        return { msgs: [{ msg: errorMsgs.UNEXPECTED_ERROR }], status: 500 };
    }
}
