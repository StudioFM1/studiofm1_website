'use strict';

const CryptoJS = require('crypto-js');
const bcrypt = require('bcryptjs');

/* Encryption constants */
let aesKey = CryptoJS.enc.Hex.parse(process.env.AES_KEY);

/**
 * Encrypts a string
 * 
 * @param {string} str the string to be encrypted 
 * @returns encrypted string
 */
exports.encrypt = str => {
    return CryptoJS.AES.encrypt(str, aesKey, { mode: CryptoJS.mode.ECB }).toString();
};

/**
 * Decrypts a string
 * 
 * @param {string} str the string to be decrypted 
 * @returns decrypted string
 */
exports.decrypt = str => {
    return CryptoJS.AES.decrypt(str, aesKey, { mode: CryptoJS.mode.ECB }).toString(CryptoJS.enc.Utf8);
};

/**
 * Generats a hash for the password
 * 
 * @param {string} password The password form which the hash will be generated
 * @returns hash
 */
exports.hashPassword = async password => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

/**
 * Compares a string with a hash
 * 
 * @param {sting} password The string to be compared with the hash
 * @param {string} hash the hash
 * @returns true or false
 */
exports.comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
}
