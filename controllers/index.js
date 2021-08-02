'use strict';

const ProducerModel = require('../models/Producer');

/* Renders the homepage */
exports.index = (req, res, next) => res.render('homepage', { title: 'Studio FM1 105.4' });

/**
 * Render registration page
 */
exports.register_producer_get = (req, res, next) => res.render('register', { title: 'Create account' });

/**
 * Create a new producer
 * redirect client to admin
 */
exports.register_producer_post = async (req, res, next) => {
    /* Insert producer and return email & password */
    await ProducerModel.insertProducer(req.body);
    /* Send response to client */
    res.status(201).json({ redirect: '/admin' });
};

/**
 * Valdiate producer's login data
 * Load producer in session
 * redirect client to admin
 */
exports.login_producer_post = async (req, res, next) => {
    /* Find and validate producer */
    const producer = await ProducerModel.validateLogin(req.body);
    /* Store producer in session */
    req.session.producer = producer;
    res.status(200).json({ redirect: '/admin' });
};
