const Exception = require('../utils/Exception');

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

exports.productValidation = (req, res, next) => {
    const {
        name,
        description,
        skus,
        images,
        categories
    } = req.body;


    if (!name || !description || !images)
        return next(new Exception('All fields are required', 401));
    
    // Image input validation
    if (!Array.isArray(images)) 
        return next(new Exception('Images must be an array', 401));
    if(images.length < 0)
        return next(new Exception('Must have at least one image', 401));

    const areAllImagesValid = images.every(image => isValidHttpUrl(image.src));
    if (!areAllImagesValid) return next(new Exception('All images must be valid.', 401));

    // name validation
    if (name.length < 3 || name.length > 255)
        return next(new Exception('Name must be between 3 and 255 characters', 401));

    // description validation
    if (description.length < 3 || description.length > 1024)
        return next(new Exception('Description must be between 3 and 1024 characters', 401));
        // category validation   
    if(!Array.isArray(categories) || categories.length < 1)
        return next(new Exception('Must have at least one category', 401));

    skus.forEach(sku => {
        const { price, size, quantity } = sku;
        // price validation
        if (price < 0 || price > 1000000)
        return next(new Exception('Price must be between 0 and 1000000', 401));

        // size validation
        if (size.length < 3 || size.length > 32)
            return next(new Exception('Size must be between 3 and 32 characters', 401));
        // quantity validation
        if (quantity < 1 || quantity > 99)
            return next(new Exception('Quantity must be between 1 and 99', 401));
    });

    next();
};
const isValidHttpUrl = (string) => {
    let url;
    
    try {
        url = new URL(string);
    } catch (_) {
        return false;  
    }
    
    return url.protocol === 'http:' || url.protocol === 'https:';
};