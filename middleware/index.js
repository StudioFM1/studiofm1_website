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
    let errors = [];

    /* Email validation */
    const validateEmail = email => {
        if (email === '') errors.push({ msg: errorMsg.EMPTY_FIELD, field: 'email' });
        else if (!email.match(emailRegex)) errors.push({ msg: errorMsg.INVALID_EMAIL, field: 'email' });
    };

    /* Password validation */
    const validatePassword = (password, field) => {
        if (password === '') errors.push({ msg: errorMsg.EMPTY_FIELD, field });
        else if (!password.match(passwordRegex)) errors.push({ msg: errorMsg.INVALID_PASSWORD, field });
    };

    /* Password confirmation */
    const comparePasswords = (password, confirmPassword) => {
        if (confirmPassword !== password) errors.push({ msg: errorMsg.PASSWORD_MISSMATCH, field: 'confirmPassword' });
    };

    /* Validate login form */
    if (formType === 'login') {
        if (req.body.email === '') errors.push({ msg: errorMsg.EMPTY_FIELD, field: 'email' });
        if (req.body.password === '') errors.push({ msg: errorMsg.EMPTY_FIELD, field: 'password' });
    } else if (formType === 'registration') {
        /* Validate registration form */
        for (const field in req.body) {
            const value = req.body[field];
            if (field === 'email') validateEmail(value);
            else if (field === 'password') validatePassword(value, field);
            else if (field === 'confirmPassword') comparePasswords(req.body['password'], value);
            else if (value === '') errors.push({ msg: errorMsg.EMPTY_FIELD, field });
        }
    } else if (formType === 'profile') {
        for(const field in req.body) {
            const value = req.body[field];
            if (field === 'bio' || field === 'password') continue;
            else if (field === 'email') validateEmail(value);
            else if (field === 'newPassword') { // If there is a new password
                if(value !== '') {
                    if (req.body['password'] === '') errors.push({ msg: errorMsg.EMPTY_CURRENT_PASSWORD, field: 'password' })
                    validatePassword(value, field);
                }
            }
            else if (value === '') errors.push({ msg: errorMsg.EMPTY_FIELD, field });
        }
    }

    /* If there are errors... */
    if (errors.length > 0) throw { msgs: errors, status: 422 };

    next();
}
