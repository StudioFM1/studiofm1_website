'use strict';

const fs = require('fs');
const path = require('path');
const multer = require('multer');
const errorMsg = require('../messages/errors.json');

/* Set storage for avatars */
const avatarStorage = multer.diskStorage({
    destination: `${__dirname}/../uploads/`,
    filename: (req, file, cb) => {
        cb(null, `avatar_${req.session.user.userId}${path.extname(file.originalname)}`);
    },
});

/* Check file type */
const checkFileType = (file, cb) => {
    /* Allowed file types */
    const fileTypes = /jpeg|jpg|png|webp|gif/;
    /* Check extension and mime type of file */
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    return mimetype && extname ? cb(null, true) : cb(errorMsg.IMG_TYPE);
};

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

/* */
exports.uploadAvatar = multer({
    storage: avatarStorage,
    limits: { fileSize: 10000000 }, // 1 megabyte
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    },
}).single('avatarInput'); // Name of file input in form
