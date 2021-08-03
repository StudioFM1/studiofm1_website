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
router.get('/logout', use(controller.producer_logout));

/**
 * @GET Producers data
 */
router.get('/producers', use(controller.producers_get));

/**
 * @POST Producer registration data
 */
router.post('/producers/register', use(mw.validateForm('registration')), use(controller.register_producer_post));

/**
 * @POST Producers status
 */
router.post('/producers/bulk', use(controller.bulk_producers_post));

/**
 * @GET Producer profile data
 */
router.get('/producers/:id', use(controller.producer_profile_get));

/**
 * @POST Upload producer avatar
 */
router.post('/producers/:id/avatar', imgMw.uploadAvatar, imgMw.optimizeAvatar, use(controller.producer_avatar_post));

/**
 * @POST producer profile
 */
router.post('/producers/:id/profile', use(mw.validateForm('profile')), use(controller.producer_profile_post));

module.exports = router;
