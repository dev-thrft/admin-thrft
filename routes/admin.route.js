const router = require('express').Router();
const { 
    signup, 
    login, 
    refreshToken, 
    logout 
} = require('../controllers/admin.controller');
const { inputValidation } = require('../middlewares/validation');
const { apiAuth } = require('../middlewares/auth');

/**
 * VERB:PATH FUNCTION
 * 
 * POST:/login LOGIN ADMIN
 * POST:/signup SIGNUP ADMIN
 * POST:/logout LOGOUT ADMIN 
 * POST:/refreshToken REFRESH TOKEN ADMIN
 */

router.post('/signup', inputValidation, apiAuth, signup);
router.post('/login', login);
router.post('/refreshToken', refreshToken);
router.post('/logout', logout);

module.exports = router;