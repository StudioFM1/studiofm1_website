'use strict';

/* Render admin dashboard */
exports.index = (req, res, next) => res.json({ dashboard: 'dashboard' });


exports.producer_logout = async (req, res, next) => {
    await req.session.destroy();
    res.redirect('/');
}