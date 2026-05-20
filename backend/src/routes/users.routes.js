const router = require('express').Router();
const ctrl = require('../controllers/users.controller');

router.get('/all', ctrl.getAllUsers);
router.get('/credentials', ctrl.getSeededCredentials);

module.exports = router;
