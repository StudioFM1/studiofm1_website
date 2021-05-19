'use strict';

const multer = require('multer');
const img = require('../helpers/images');
const sharp = require('sharp');
sharp.cache(false);

/* */
exports.uploadAvatar = (req, res, next) => {
    multer({
        storage: img.storage,
        limits: { fileSize: 5 * 1000 * 1000 }, // 5 megabyte
        fileFilter: (req, file, cb) => {
            return img.checkFileType(file, cb);
        },
    }).single('userAvatar')(req, res, err => {
        if (err) return next(err);
        next();
    });
};

/* */
exports.optimizeAvatar = (req, res, next) => {
    const inputPath = `${__dirname}/../uploads/${req.fileName}`;
    const outputPath = `${__dirname}/../public/images/avatars/${req.fileName}`;
    sharp(inputPath)
        .resize(210, 210)
        .png()
        .toFile(outputPath, (err, resizeImage) => {
            if (err) return next(err);
            next();
        });
};
