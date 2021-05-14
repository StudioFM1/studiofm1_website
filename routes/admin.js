const express = require('express');
const router = express.Router();
const mw = require('../middleware');
const controller = require('../controllers/admin');

/**
 * Caller function for global error handling
 * route all calls trhough here to try and
 * catch any possible errors
 */

const use = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/**
 * @GET Admin dashboard
 */
router.get('/', use(controller.index));

/**
 * @GET Destroy session
 */
router.get('/logout', use(controller.user_logout));

/**
 * @GET user profile
 */
router.get('/users/:id', use(controller.user_profile_get));

/**
 * @PUT update user profile
 */
router.put('/users/:id', use(mw.validateForm('profile')), use(controller.user_profile_put));


module.exports = router;
