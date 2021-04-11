'use strict';
exports.isLoggedIn = (req, res, next) => {
    if (req.session.user) return next();
    res.render('login', { title: 'Studio FM1 Login' });
};
