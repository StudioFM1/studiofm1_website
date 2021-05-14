'use strict';

const fs = require('fs');

/**
 * Reads the /public/gidia directory
 * and picks a random file
 * 
 * @returns the random file
 */
exports.getRandomGidi = () =>
    new Promise((resolve, reject) => {
        fs.readdir(`${__dirname}/../public/images/avatars/gidia`, (err, files) => {
            if (err) return reject(err);

            const randomIndex = Math.floor(Math.random() * files.length);
            resolve(`/images/avatars/gidia/${files[randomIndex]}`);
        });
    });
