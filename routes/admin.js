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
 * @POST Producer registration data
 */
router.post('/register', use(mw.validateForm('registration')), use(controller.register_producer_post));

/**
 * @GET Destroy session
 */
router.get('/logout', use(controller.producer_logout));

/**
 * @GET Producers
 */
router.get('/producers', use(controller.producers_get));

/**
 * @GET Producer profile data
 */
router.get('/producers/:id', use(controller.producer_profile_get));

/**
 * @PUT Update producer profile
 */
router.put('/producers/:id', use(mw.validateForm('profile')), use(controller.producer_profile_put));

/**
 * @POST Update producer avatar
 */
router.post('/producers/upload/:id', imgMw.uploadAvatar, imgMw.optimizeAvatar, use(controller.producer_avatar_post));

/**
 * @POST Update producer status
 */
router.post('/producers/status/:id', use(controller.producer_status_post));

module.exports = router;
