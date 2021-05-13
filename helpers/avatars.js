'use strict';

const fs = require('fs');

/* Get a random tragi for default avatar */
exports.getRandomGidi = () =>
    new Promise((resolve, reject) => {
        fs.readdir(`${__dirname}/../public/images/avatars/gidia`, (err, files) => {
            if (err) return reject(err);

            const randomIndex = Math.floor(Math.random() * files.length);
            resolve(`/images/avatars/gidia/${files[randomIndex]}`);
        });
    });
