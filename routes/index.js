const router = require('express').Router();

router.use('/auth', require('./users'));

module.exports = router;