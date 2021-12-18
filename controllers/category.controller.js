const Category = require('../models/category.model');

exports.getCategories = async (req, res, next) => {
    try {
        await Category.find()
            .then(categories => {
                res.status(200).json({
                    success: true,
                    categories
                });
            })
            .catch(err => next(err));
    } catch (err) {
        return next(err);
    }
};

exports.createCategory = async (req, res, next) => {
    try {
        const { category } = req.body;
        
        await Category.create({category})
            .then(() => {
                res.status(201).json({
                    success: true,
                    message: 'Category created successfully',
                });
            })
            .catch(err => next(err));
    } catch (err) {
        return next(err);
    }
};

exports.deleteCategory = async (req, res, next) => {
    try {
        const { category } = req.body;
        await Category.deleteOne({ category })
            .then(() => {
                res.status(200).json({
                    success: true,
                    message: 'Category deleted successfully',
                });
            })
            .catch(err => next(err));
    } catch (err) {
        return next(err);
    }
};