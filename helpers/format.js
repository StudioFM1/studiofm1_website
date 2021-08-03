'use strict'

const errorMsgs = require('../messages/errors.json');

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

exports.sortProducers = (producers, sortingMethod) => {
    switch (sortingMethod) {
        case 'lastname_descending':
            producers.sort((a, b) => b.profile.lastName.localeCompare(a.profile.lastName));
            break;
        case 'firstname_ascending':
            producers.sort((a, b) => a.profile.firstName.localeCompare(b.profile.firstName)); // Sort by lastname - ascending
            break;
        case 'firstname_descending':
            producers.sort((a, b) => b.profile.firstName.localeCompare(a.profile.firstName));
            break;
        case 'creation_ascending':
            producers.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
            break;
        case 'creation_descending':
            producers.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            break;
        default:
            producers.sort((a, b) => a.profile.lastName.localeCompare(b.profile.lastName)); // Sort by lastname - ascending
    }

    return producers;
};

exports.formatDate = date => {
    return `${date.getDay() + 1}/${date.getMonth() + 1}/${date.getFullYear()}`;
};