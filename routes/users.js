const router = require('express').Router();
const controller = require('../controllers/users');

router.get('/me', controller.getMe);

module.exports = router;
