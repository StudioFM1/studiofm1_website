'use strict';

const { insertUser, validateLogin } = require('../models/User');

/* Renders the homepage */
exports.index = (req, res, next) =>
    res.render('homepage', { title: 'Studio FM1 105.4' });

/* Render register page */
exports.register_user_get = (req, res, next) =>
    res.render('register', { title: 'Create account' });

/* Register a new user */
exports.register_user_post = async (req, res, next) => {
    /* Insert producer and return email & password */
    await insertUser(req.body);
    /* Send response to client */
    res.status(201).json({ redirect: '/admin' });
}

/* Login a user */
exports.login_user_post = async (req, res, next) => {
    /* Find and validate user */
    const user = await validateLogin(req.body);
    /* Store producer in session */
    req.session.user = user;
    res.status(200).json({ redirect: '/admin' });
}
