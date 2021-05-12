'use strict'

/* Format an error before sending to the client */
exports.clientError = err => {
    console.log(err)
    if (err.constructor.name === 'MongoError') {
        if (err.code === 11000) { // Duplicate key error
            let duplicate = Object.keys(err.keyPattern)[0];
            if(duplicate === 'profile.email')
                return { message: 'A user with this email already exists', status: 409 }
            else if (duplicate === 'profile.username')
                return { message: 'This username is already taken', status: 409 }
        }
    } else {
        return { message: 'Something went wrong', status: 500 }
    }
}
