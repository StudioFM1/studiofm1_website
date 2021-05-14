'use strict';

const { insertUser, validateLogin } = require('../models/User');

/* Renders the homepage */
exports.index = (req, res, next) =>
    res.render('homepage', { title: 'Studio FM1 105.4' });

/**
 * @description
 * Render registration page
 */
exports.register_user_get = (req, res, next) =>
    res.render('register', { title: 'Create account' });

/**
 * @description
 * Create a new user
 * redirect client to admin
 */
exports.register_user_post = async (req, res, next) => {
    /* Insert producer and return email & password */
    await insertUser(req.body);
    /* Send response to client */
    res.status(201).json({ redirect: '/admin' });
}

/**
 * @description
 * Valdiate user's login data
 * Load user in session
 * redirect client to admin
 */
exports.login_user_post = async (req, res, next) => {
    /* Find and validate user */
    const user = await validateLogin(req.body);
    /* Store producer in session */
    req.session.user = user;
    res.status(200).json({ redirect: '/admin' });
}
