'use strict';

const Mongoose = require('mongoose');

/**
 * Creates a mongoDB connection
 * 
 * @param {string} mongoURI The mongo URI (duh!)
 */
const connectToMongo = async mongoURI => {
    try {
        await Mongoose.connect(mongoURI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
    } catch (err) {
        throw err;
    }
};

module.exports = connectToMongo;
