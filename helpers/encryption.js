'use strict';

const CryptoJS = require('crypto-js');
const bcrypt = require('bcryptjs');

/* Encryption constants */
let aesKey = CryptoJS.enc.Hex.parse(process.env.AES_KEY);

/**
 * Encrypts a string
 * returns encrypted string
 */
exports.encrypt = str => {
    return CryptoJS.AES.encrypt(str, aesKey, { mode: CryptoJS.mode.ECB }).toString();
};

/**
 * Decrypts a string
 * returns decrypted string
 */
exports.decrypt = str => {
    return CryptoJS.AES.decrypt(str, aesKey, { mode: CryptoJS.mode.ECB }).toString(CryptoJS.enc.Utf8);
};

/**
 * Generats a hash for the password
 * returns hash
 */
exports.hashPassword = async password => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

/**
 * Compares a string with a hash
 * returns true or false
 */
exports.comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
}
