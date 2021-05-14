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
        if (email === '') errors.push({ msg: errorMsg.EMPTY_FIELDS, field: 'email' });
        else if (!email.match(emailRegex)) errors.push({ msg: errorMsg.INVALID_EMAIL, field: 'email' });
    };

    /* Password validation */
    const validatePassword = password => {
        if (password === '') errors.push({ msg: errorMsg.EMPTY_FIELDS, field: 'password' });
        else if (!password.match(passwordRegex)) errors.push({ msg: errorMsg.INVALID_PASSWORD, field: 'password' });
    };

    /* Password confirmation */
    const comparePasswords = (password, confirmPassword) => {
        if (confirmPassword !== password) errors.push({ msg: errorMsg.PASSWORD_MISSMATCH, field: 'confirmPassword' });
    };

    /* Validate login form */
    if (formType === 'login') {
        if (req.body.email === '') errors.push({ msg: errorMsg.EMPTY_FIELDS, field: 'email' });
        if (req.body.password === '') errors.push({ msg: errorMsg.EMPTY_FIELDS, field: 'password' });
    } else if (formType === 'registration') {
        /* Validate registration form */
        for (const field in req.body) {
            const value = req.body[field];
            if (field === 'email') validateEmail(value);
            else if (field === 'password') validatePassword(value);
            else if (field === 'confirmPassword') comparePasswords(req.body['password'], value);
            else if (value === '') errors.push({ msg: errorMsg.EMPTY_FIELDS, field });
        }
    } else if (formType === 'profile') {
        for(const field in req.body) {
            const value = req.body[field];
            if(field === 'bio') continue;
            if (field === 'email') validateEmail(value);
            else if (value === '') errors.push({ msg: errorMsg.EMPTY_FIELDS, field });
        }
    }

    /* If there are errors... */
    if (errors.length > 0) throw { msgs: errors, status: 422 };

    next();
}
