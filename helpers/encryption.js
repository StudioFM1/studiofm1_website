'use strict';

/* Dependencies and files */
const CryptoJS = require('crypto-js');
const bcrypt = require('bcryptjs');

/* Encryption constants */
let aesKey = CryptoJS.enc.Hex.parse(process.env.AES_KEY);

/* Encrypt */
exports.encrypt = str => {
    return CryptoJS.AES.encrypt(str, aesKey, { mode: CryptoJS.mode.ECB }).toString();
};

/* Decrypt */
exports.decrypt = str => {
    return CryptoJS.AES.decrypt(str, aesKey, { mode: CryptoJS.mode.ECB }).toString(CryptoJS.enc.Utf8);
};

/* Hash password string */
exports.hashPassword = async password => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

/* Compare passwords */
exports.comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
}
