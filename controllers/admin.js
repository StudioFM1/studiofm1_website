'use strict';

const UserModel = require('../models/User');
const successMsg = require('../messages/success.json');

/* Render admin dashboard */
exports.index = (req, res, next) => {
    res.render('admin/dashboard', { title: 'Admin dashboard', user: req.session.user });
};

/**
 * Create a new user
 * redirect client to admin
 */
exports.register_user_post = async (req, res, next) => {
    /* Insert producer and return email & password */
    await UserModel.insertUser(req.body);
    /* Send response to client */
    res.json({});
};

/**
 * Destroy session
 * Redirect client to home
 */
exports.user_logout = async (req, res, next) => {
    await req.session.destroy();
    res.redirect('/');
};

/**
 * Get a list of user
 * Render a user list
 */
exports.users_get = async (req, res, next) => {
    const users = await UserModel.getUsers();
    res.render('admin/users', { title: 'Producers', user: req.session.user, users });
};

/**
 * Get user's profile data
 * Render user's profile page
 */
exports.user_profile_get = async (req, res, next) => {
    const user = await UserModel.getUserData(req.params.id);
    res.render('admin/profile', { title: 'My profile', user });
};

/**
 * Update user's data
 * Send success message in response
 */
exports.user_profile_put = async (req, res, next) => {
    await UserModel.updateUserData(req.params.id, req.body);
    res.json({ success: successMsg.PROFILE_UPDATE });
};

/**
 * Saves new avatar's path
 * responds with a success message
 */
exports.user_avatar_post = async (req, res, next) => {
    await UserModel.updateUserAvatar(req.params.id, req.fileName);
    res.json({});
};

/**
 * Updates user's status
 * End request
 */
exports.user_status_post = async (req, res, next) => {
    const user = await UserModel.updateUserStatus(req.params.id, req.body);
    res.json(user);
};