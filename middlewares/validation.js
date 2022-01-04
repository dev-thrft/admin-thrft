const Exception = require('../utils/Exception');
const { isValidHttpUrl } = require('../utils/urlValidator');
const { Limitter, ArrayLimitter } = require('../utils/limitter');
// for admin validation
exports.inputValidation = (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) 
        return next(new Exception('Username and password are required', 401));

    if (username.length < 3 || username.length > 20) 
        return next(new Exception('Username must be between 3 and 20 characters', 401));

    if (password.length < 6 || password.length > 20) 
        return next(new Exception('Password must be between 8 and 20 characters', 401));

    next();
};

// for product validation
exports.productValidation = (req, res, next) => {
    const {
        name,
        description,
        categories,
        quality,
        skus,
        images
    } = req.body;


    if (!name || !description || !images || !skus || !categories || !quality)
        return next(new Exception('All fields are required', 401));
    
    // Image input validation
    ArrayLimitter(images, 1, 5, 'Images', next);

    // category validation   
    ArrayLimitter(categories, 1, 8, 'Categories', next);

    // Image url validation
    const areAllImagesValid = images.every(image => isValidHttpUrl(image.src));
    if (!areAllImagesValid) 
        return next(new Exception('All images must be valid.', 401));

    // name validation
    Limitter(name.length, 3, 255, 'Name', next);

    // description validation
    Limitter(description.length, 3, 1024, 'Description', next);
       
    // quality validation
    Limitter(quality.length, 2, 3, 'Quality', next);
    skus.forEach(sku => {
        const { price, size, quantity } = sku;
        // price validation
        Limitter(price, 1, 1000000, 'Price', next);

        // size validation
        Limitter(size.length, 3, 32, 'Size', next);
        
        // quantity validation
        Limitter(quantity, 1, 99, 'Quantity', next);
    });

    next();
};

