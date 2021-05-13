'use strict';

const { getUserData } = require('../models/User');

/* Render admin dashboard */
exports.index = (req, res, next) => res.render('admin/dashboard', { title: 'Admin dashboard', user: req.session.user });

/* Logout the user */
exports.user_logout = async (req, res, next) => {
    await req.session.destroy();
    res.redirect('/');
}

/* Get user's profile */
exports.user_profile_get = async (req, res, next) => {
    const userProfile = await getUserData(req.params.id);
    res.render('admin/profile', { title: 'My profile', user: userProfile });
}