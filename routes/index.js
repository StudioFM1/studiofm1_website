const express = require('express');
const router = express.Router();
const mw = require('../middleware');
const controller = require('../controllers');

/**
 * Caller function for global error handling
 * route all calls trhough here to try and
 * catch any possible errors
 */

const use = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/**
 * @GET homepage
 */
router.get('/', use(controller.index));

/**
 * @GET Register page
 */
router.get('/register', mw.isAllowed, use(controller.register_user_get));

/**
 * @POST Register user
 */
router.post('/register', mw.isAllowed, use(mw.validateForm('registration')), use(controller.register_user_post));

/**
 * @POST Login user
 */
router.post('/login', use(mw.validateForm('login')), use(controller.login_user_post));

module.exports = router;
