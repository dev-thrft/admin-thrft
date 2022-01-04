const Product = require('../models/product.model');
const ProductArchive = require('../models/archive/product.archive');

const Exception = require('../utils/Exception');

exports.getProducts = async (req, res, next) => {
    try {
        await Product.find()
            .then(products => {
                res.status(200).json({
                    success: true,
                    products
                });
            })
            .catch(err => next(err));
    } catch (err) {
        return next(err);
    }
};

exports.createProduct = async (req, res, next) => {
    try {
        const { 
            name,   
            description, 
            skus,
            categories,
            images,
        } = req.body;

        const product = new Product({
            name,
            description,
            categories,
            skus,
            images
        });
        await product.save()
            .then(() => {
                res.status(201).json({
                    success: true,
                    message: 'Product created successfully',
                });
            })
            .catch(err => next(err));
    } catch (err) {
        return next(err);
    }
};

exports.createMultipleProducts = async (req, res, next) => {
    try {
        const { products } = req.body;
        const productsToCreate = [];
        products.forEach(product => {
            productsToCreate.push(new Product(product));
        });
        const length = productsToCreate.length;
        await Product.insertMany(productsToCreate)
            .then(() => {
                res.status(201).json({
                    success: true,
                    message: `${length} products created successfully.`
                });
            })
            .catch(err => next(err));
    } catch (err) {
        return next(err);
    }
};

exports.getProduct = async (req, res, next) => {
    const { id } = req.params;
    try {
        await Product.findById(id)
            .then(product => {
                res.status(200).json({
                    success: true,
                    product
                });
            })
            .catch(err => next(err));
    }
    catch (err) {
        return next(err);
    }
};

exports.updateProduct = async (req, res, next) => {
    const { id } = req.params;
    const { 
        name, 
        description,
        images, 
        categories 
    } = req.body;
    try {
        if(!id) return next(new Exception('Product ID is required', 401));
        await Product.findByIdAndUpdate(id, {
            name,
            description,
            images,
            categories
        })
            .then(() => {
                res.status(200).json({
                    success: true,
                    message: 'Product updated successfully'
                });
            })
            .catch(err => next(err));
    }
    catch (err) {
        return next(err);
    }
};

exports.deleteProduct = async (req, res, next) => {
    const { id } = req.params;
    try {
        if(!id) return next(new Exception('Product ID is required', 401));
        await Product.findById(id)
            .then(product => {
                // Move product to archive
                    const archive = new ProductArchive(product.toJSON());
                    archive.isArchived = true;
                    archive.archivedAt = new Date();

                    archive.save(); // Save to archive
                    product.remove(); // Remove from main product db

                    res.status(200).json({
                        success: true,
                        message: 'Product deleted successfully'
                    });
            })
            .catch(err => next(err));
    }
    catch (err) {
        return next(err);
    }
};
exports.restoreProduct = async (req, res, next) => {
    const { id } = req.params;
    try {
        if(!id) return next(new Exception('Product ID is required', 401));
        await ProductArchive.findById(id)
            .then(archived => {
                // Move archived item to product
                    const product = new Product(archived.toJSON());
                    product.isArchived = true;
                    product.archivedAt = null;

                    product.save(); // Save to archive
                    archived.remove(); // Remove from main product db

                    res.status(200).json({
                        success: true,
                        message: 'Product restored successfully.'
                    });
            })
            .catch(err => next(err));
    }
    catch (err) {
        return next(err);
    }
};
exports.getArchivedProducts = async (req, res, next) => {
    try {
        await ProductArchive.find()
            .then(products => {
                res.status(200).json({
                    success: true,
                    products
                });
            })
            .catch(err => next(err));
    }
    catch (err) {
        return next(err);
    }
};

exports.addSKU = async (req, res, next) => {
    const { id } = req.params;
    const { sku } = req.body;
    try {
        if(!id) return next(new Exception('Product ID is required', 401));
        await Product.findById(id)
            .then(product => {
                product.skus.push(sku);
                product.save();
                res.status(200).json({
                    success: true,
                    message: 'SKU added successfully'
                });
            })
            .catch(err => next(err));
    }
    catch (err) {
        return next(err);
    }
};

exports.removeSKU = async (req, res, next) => {
    const { id } = req.params;
    const { size, count } = req.body;

    try {
        if(!id) return next(new Exception('Product ID is required', 401));
        await Product.findById(id)
            .then(product => {
                const { skus } = product; 
                const filtered = skus.filter(sku => size === sku.size).slice(0, skus.length-count);
                const newSKUs = [...product.skus, filtered];
                product.skus = newSKUs;
                product.save();
                res.status(200).json({
                    success: true,
                    message: 'SKU/s removed successfully.'
                });
            })
            .catch(err => next(err));
    }
    catch (err) {
        return next(err);
    }
};

exports.updateSKU = async (req, res, next) => {
    const { id } = req.params;
    const { skuId, price, size, quantity, category } = req.body;
    try {
        if(!id) return next(new Exception('Product ID is required', 401));
        await Product.findById(id)
            .then(product => {
                const newSKUs = product.skus.map(sku => {
                    if(sku.skuId.toString() === skuId) {
                        sku.price = price;
                        sku.size = size;
                        sku.quantity = quantity;
                        sku.category = category;
                    }
                    return sku;
                });
                product.skus = newSKUs;
                product.save();
                res.status(200).json({
                    success: true,
                    message: 'SKU updated successfully.'
                });
            })
            .catch(err => next(err));
    }
    catch (err) {
        return next(err);
    }
};