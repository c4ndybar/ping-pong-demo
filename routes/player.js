let router = require('express').Router();

router.get('/', (req, res) => {
    res.send({});
});

router.get('/:id', (req, res) => {
    res.send({});
});

module.exports = router;