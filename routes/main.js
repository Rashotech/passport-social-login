const router = require('express').Router();  

// Home
router.get('/', (req, res, next) => {
    res.render('index')
});

// Error
router.get('/error', (req, res, next) => {
    res.render('error')
});


module.exports = router;