const mongoose = require('mongoose');   
const Category = require('./category.model');
const Exception = require('../utils/Exception');

/**
 * New Product Model will be:
 * 
 * Name
 * Description
 * Category
 * Quality
 * SKU :
 *      SkuId
 *      price
 *      size
 *      quantity
 * Images :
 *      id
 *      title
 *      src
 */

const ProductSchema = new mongoose.Schema({
    n: {
        type: String,
        required: [
            true,
            'Product name is required.'
        ], 
        trim: true,
        minlength: 3,
        maxlength: 255,
        alias: 'name'
    },
    desc: {
        type: String,
        required: [
            true,
            'Product description is required.'
        ],
        trim: true,
        minlength: 3,
        maxlength: 1024,
        alias: 'description'
    },
    categories: [
        {
            type: String,
            required: true,
        }
    ],
    qua: {
        type: String,
        required: true,
        alias: 'quality'    
    },
    skus: [
        new mongoose.Schema(
            {
                sid: {
                    type: String,
                    required: true,
                    alias: 'skuId'
                },
                p: {
                    type: Number,
                    required: [
                        true,
                        'SKU price is required.'
                    ],
                    trim: true,
                    min: 0,
                    alias: 'price'
                },
                s: {
                    type: String,
                    required: [
                        true,
                        'SKU size is required.'
                    ],
                    trim: true,
                    maxlength: 32,
                    alias: 'size'
                },
                sx: {
                    type: String,
                    required: [
                        true,
                        'SKU sex is required.'
                    ],
                    trim: true,
                    maxlength: 8,
                    alias: 'sex'
                },
                q: {
                    type: Number,
                    trim: true,
                    min: 1,
                    max: 99,
                    alias: 'quantity'
                }
            },
        {_id: false})
    ],
    imgs: {
        type: [
            new mongoose.Schema({
                t: {
                    type: String,
                    required: true,
                    alias: 'title'
                },
                s: {
                    type: String,
                    required: true,
                    alias: 'src'
                }
            })
        ],
        alias: 'images'
    },
    isa: {
        type: Boolean,
        alias: 'isArchived'
    },
    aat: {
        type: Date,
        alias: 'archivedAt'
    }
},{
    timestamps: true,
    collection: 'products'
});

// sanitize categories before saving
ProductSchema.pre('save', async function(next) {
    const product = this;

    const availableCategories = await Category.find({},'-_id -__v'); // do not include _id and __v

    if(!product.isModified('skus')) 
        return next();
    
    // check category
    const categories = product.categories;

    categories.forEach(category => {
        // trim for unneccessary spaces and convert to lowercase
        category = category.trim().toLowerCase();

        // if category is not available, throw error
        const isAvailable = availableCategories.find(cat => cat.category === category);

        if(!isAvailable)
            return next(new Exception(`Category ${category} is invalid.`, 401));
    });

    // finished sanitizing
    next();
});


module.exports = mongoose.model('Product', ProductSchema);