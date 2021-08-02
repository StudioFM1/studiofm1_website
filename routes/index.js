'use strict';

const express = require('express');
const router = express.Router();
const mw = require('../middleware');
const controller = require('../controllers');

/**
 * Caller function for global error handling
 * route all calls trhough here to try and
 * catch any possible errors
 */

const use = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/**
 * @GET Homepage
 */
router.get('/', use(controller.index));

/**
 * @GET Registration page
 */
router.get('/register', mw.isAllowed, use(controller.register_producer_get));

/**
 * @POST Producer registration data
 */
router.post('/register', mw.isAllowed, use(mw.validateForm('registration')), use(controller.register_producer_post));

/**
 * @POST Producer login data
 */
router.post('/login', use(mw.validateForm('login')), use(controller.login_producer_post));

module.exports = router;
