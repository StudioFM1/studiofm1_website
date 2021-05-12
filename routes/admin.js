const express = require('express');
const router = express.Router();
const controller = require('../controllers/admin');

/**
 * Caller function for global error handling
 * route all calls trhough here to try and
 * catch any possible errors
 */

const use = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/* Admin dashboard */
router.get('/', use(controller.index));


module.exports = router;
