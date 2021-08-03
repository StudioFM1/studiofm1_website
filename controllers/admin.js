'use strict';

const ProducerModel = require('../models/Producer');
const successMsg = require('../messages/success.json');

/* Render admin dashboard */
exports.index = (req, res, next) => {
    res.render('admin/dashboard', { title: 'Admin dashboard', producer: req.session.producer });
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
    const view = req.query.view;

    /* Get and group producers */
    const producers = await ProducerModel.getProducers();
    let producerObject = {};

    switch (view) {
        case 'roleView':
            producerObject = {
                admin: [...producers.filter(producer => producer.profile.role === 'admin')],
                editor: [...producers.filter(producer => producer.profile.role === 'editor')],
                author: [...producers.filter(producer => producer.profile.role === 'author')],
                basic: [...producers.filter(producer => producer.profile.role === 'basic')],
            };
            break;
        case 'statusView':
            producerObject = {
                active: [...producers.filter(producer => producer.status.isActive)],
                inactive: [...producers.filter(producer => !producer.status.isActive)],
            };
            break;
        default:
            producerObject = { producers };
    }

    res.render('admin/producers', { title: 'Producers', producer: req.session.producer, producerObject });
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
 * Get producer's profile data
 * Render producer's profile page
 */
exports.producer_profile_get = async (req, res, next) => {
    const producer = await ProducerModel.getProducerData(req.params.id);
    res.render('admin/profile', { title: 'My profile', producer });
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
 * Update producer's data
 * Send success message in response
 */
exports.producer_profile_post = async (req, res, next) => {
    const producer = await ProducerModel.updateProducerData(req.params.id, req.body);
    req.session.producer = producer;
    res.json({ success: successMsg.PROFILE_UPDATE });
};