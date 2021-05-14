'use strict';

const { getUserData, updateUserData } = require('../models/User');
const successMsg = require('../messages/success.json');

/* Render admin dashboard */
exports.index = (req, res, next) => res.render('admin/dashboard', { title: 'Admin dashboard', user: req.session.user });

/**
 * @description
 * Destroy session
 * redirect client home
 */
exports.user_logout = async (req, res, next) => {
    await req.session.destroy();
    res.redirect('/');
}

/**
 * @description
 * Get user's profile data
 * Render user's profile page
 */
exports.user_profile_get = async (req, res, next) => {
    const user = await getUserData(req.params.id);
    res.render('admin/profile', { title: 'My profile', user: user });
};

/**
 * @description
 * Update user's data
 * Send success message
 * in response
 */
exports.user_profile_put = async (req, res, next) => {
    const updatedUser = await updateUserData(req.params.id, req.body);
    res.json({ success: successMsg.PROFILE_UPDATE });
};