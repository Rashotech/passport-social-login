const router = require('express').Router();

router.use('/', require('./main'));
router.use('/auth', require('./users'));

module.exports = router;