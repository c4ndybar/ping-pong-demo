let router = require('express').Router();

router.use('/players', require('./player'));

module.exports = router;