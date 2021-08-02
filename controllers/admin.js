'use strict';

const ProducerModel = require('../models/Producer');
const successMsg = require('../messages/success.json');

/* Render admin dashboard */
exports.index = (req, res, next) => {
    res.render('admin/dashboard', { title: 'Admin dashboard', producer: req.session.producer });
};

/**
 * Create a new producer
 * redirect client to admin
 */
exports.register_producer_post = async (req, res, next) => {
    /* Insert producer and return email & password */
    await ProducerModel.insertProducer(req.body);
    /* Send response to client */
    res.json({});
};

/**
 * Destroy session
 * Redirect client to home
 */
exports.producer_logout = async (req, res, next) => {
    await req.session.destroy();
    res.redirect('/');
};

/**
 * Get a list of producers
 * Render a producer list
 */
exports.producers_get = async (req, res, next) => {
    const producers = await ProducerModel.getProducers();
    res.render('admin/producers', { title: 'Producers', producer: req.session.producer, producers });
};

/**
 * Get producer's profile data
 * Render producer's profile page
 */
exports.producer_profile_get = async (req, res, next) => {
    const producer = await ProducerModel.getProducerData(req.params.id);
    res.render('admin/profile', { title: 'My profile', producer });
};

/**
 * Update producer's data
 * Send success message in response
 */
exports.producer_profile_put = async (req, res, next) => {
    await ProducerModel.updateProducerData(req.params.id, req.body);
    res.json({ success: successMsg.PROFILE_UPDATE });
};

/**
 * Saves new avatar's path
 * responds with a success message
 */
exports.producer_avatar_post = async (req, res, next) => {
    await ProducerModel.updateProducerAvatar(req.params.id, req.fileName);
    res.json({});
};

/**
 * Updates producer's status
 * End request
 */
exports.producer_status_post = async (req, res, next) => {
    const producer = await ProducerModel.updateProducerStatus(req.params.id, req.body);
    res.json(producer);
};