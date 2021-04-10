const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('homepage', { title: 'Studio FM1 105.4' });
});

module.exports = router