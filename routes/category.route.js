const router = require('express').Router();
const {auth} = require('../middlewares/auth');
const {
    createCategory,
    getCategories,
    deleteCategory
} = require('../controllers/category.controller');

/**
 * VERB:PATH FUNCTION AUTH:BOOL
 * 
 * GET:/ GET PRODUCTS | AUTH:FALSE
 * POST:/ CREATE PRODUCT | AUTH:TRUE
 * DELETE:/ DELETE PRODUCT BY CATEGORY NAME | AUTH:TRUE
 */

router.post('/', auth, createCategory);
router.get('/', getCategories);
router.delete('/', auth, deleteCategory);

module.exports = router;