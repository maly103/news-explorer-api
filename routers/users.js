const router = require('express').Router();
const { getUsers, getUserMe } = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserMe);
module.exports = router;
