const router = require('express').Router();
const {
    productValidation
} = require('../middlewares/validation');
const { auth } = require('../middlewares/auth');

const {
    getProducts,
    getProduct,
    createProduct,
    createMultipleProducts,
    updateProduct,
    deleteProduct,
    restoreProduct,
    getArchivedProducts,
    getUploadURL

} = require('../controllers/product.controller');
/**
 * VERB:PATH FUNCTION AUTH:BOOL
 * 
 * GET:/ GET PRODUCTS | AUTH:FALSE
 * POST:/create CREATE PRODUCT | AUTH:TRUE
 * POST:/createMultiple CREATE MULTIPLE PRODUCTS | AUTH:TRUE 
 * GET:/:id GET PRODUCT BY ID | AUTH:FALSE
 * PUT:/update/:id UPDATE PRODUCT BY ID | AUTH:TRUE
 * DELETE:/:id DELETE PRODUCT BY ID | AUTH:TRUE
 * POST:/restore/:id RESTORE PRODUCT BY ID | AUTH:TRUE
 * GET:/archived/ GET ARCHIVED PRODUCTS | AUTH:TRUE
 * POST:/retrieveURL/ UPLOAD PRODUCT IMAGE | AUTH:TRUE
 */

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/create', productValidation, auth, createProduct);
router.post('/createMultiple', productValidation, auth, createMultipleProducts);
router.put('/:id',productValidation, auth, updateProduct);
router.delete('/:id', auth, deleteProduct);
router.post('/restore/:id', auth, restoreProduct);
router.get('/archived', auth, getArchivedProducts);

router.get('/retrieveURL', getUploadURL);
module.exports = router;