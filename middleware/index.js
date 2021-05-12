'use strict';

const errorMsg = require('../messages/errors.json');

/* Email & password formats */
const emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
const passwordRegex = /^(?=.*[a-z]).{8,}$/;

/* Is registration allowed */
exports.isAllowed = (req, res, next) => {
    if(process.env.REGISTRATION === 'ALLOWED') return next();
    res.redirect('/');
}

/* Checks if user is logged in */
exports.isLoggedIn = (req, res, next) => {
    if (req.session.user) return next();
    res.render('login', { title: 'Studio FM1 Login' });
};

/* Validate forms */
exports.validateForm = formType => (req, res, next) => {
    /* Email validation */
    const validateEmail = (email) => {
        if (email === '') throw { message: errorMsg.EMPTY_FIELDS, status: 422 };
        else if (!email.match(emailRegex))
            throw { message: errorMsg.INVALID_EMAIL, status: 422 };
    }

    /* Password validation */
    const validatePassword = (password) => {
        if (password === '') throw { message: errorMsg.EMPTY_FIELDS, status: 422 };
        else if (!password.match(passwordRegex))
            throw { message: errorMsg.INVALID_PASSWORD, status: 422 };
    }

    /* Password confirmation */
    const comparePasswords = (password, confirmPassword) => {
        if (confirmPassword !== password)
            throw { message: errorMsg.PASSWORD_MISSMATCH, status: 422 };
    }

    /* Validate registration form */
    if (formType === 'registration') {
        for(const key in req.body) {
            const value = req.body[key];
            if (key === 'email')
                validateEmail(value);
            else if (key === 'password')
                validatePassword(value);
            else if (key === 'confirmPassword')
                comparePasswords(req.body['password'], value);
            else if (value === '')
                throw { message: errorMsg.EMPTY_FIELDS, status: 422 };
        }
    }

    next();
}
