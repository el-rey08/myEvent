const express = require('express');
const { Register, Login } = require('../controller/userController');
const { singUpValidation, logInValidator } = require('../middleware/validation');
const router = express.Router();

router.post('/register',singUpValidation, Register);
router.post('/login', logInValidator,Login);

module.exports = router;

