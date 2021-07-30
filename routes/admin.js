'use strict';

const express = require('express');
const router = express.Router();
const mw = require('../middleware');
const imgMw = require('../middleware/images');
const controller = require('../controllers/admin');

/**
 * Caller function for global error handling
 * route all calls trhough here to try and
 * catch any possible errors
 */
const use = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/**
 * @GET Admin dashboard
 */
router.get('/', use(controller.index));

/**
 * @GET Destroy session
 */
router.get('/logout', use(controller.user_logout));

/**
 * @GET Users
 */
router.get('/users', use(controller.users_get));

/**
 * @GET User profile data
 */
router.get('/users/:id', use(controller.user_profile_get));

/**
 * @PUT Update user profile
 */
router.put('/users/:id', use(mw.validateForm('profile')), use(controller.user_profile_put));

/**
 * @POST Update user avatar
 */
router.post('/users/upload/:id', imgMw.uploadAvatar, imgMw.optimizeAvatar, use(controller.user_avatar_post));

/**
 * @POST Update user status
 */
router.post('/users/status/:id', use(controller.user_status_post));

module.exports = router;
