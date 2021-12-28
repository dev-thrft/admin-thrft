const mongoose = require('mongoose');   
const Category = require('./category.model');
const Exception = require('../utils/Exception');

/**
 * New Product Model will be:
 * 
 * Name
 * Description
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
    skus: [
        new mongoose.Schema(
            {
                sid: {
                    type: mongoose.Types.ObjectId,
                    required: true,
                    default: mongoose.Types.ObjectId(),
                    alias: 'skuId'
                },
                p: {
                    type: Number,
                    required: [
                        true,
                        'Product price is required.'
                    ],
                    trim: true,
                    min: 0,
                    alias: 'price'
                },
                s: {
                    type: String,
                    required: [
                        true,
                        'Product size is required.'
                    ],
                    trim: true,
                    maxlength: 32,
                    alias: 'size'
                },
                q: {
                    type: Number,
                    trim: true,
                    min: 1,
                    max: 99,
                    alias: 'quantity'
                },
                cat: [String]
            },
        {_id: false})
    ],
    imgs: {
            type: [new mongoose.Schema({
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
            })] ,
            alias: 'images'
        }
    ,
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

// sanitize catogeries before saving
ProductSchema.pre('save', async function(next) {
    const product = this;

    const availableCategories = await Category.find({},'-_id -__v');

    if(!product.isModified('skus')) 
        return next();
    
    // check category
    const categories = product.skus.map(sku => sku.cat).flat();

    categories.forEach(category => {
        // if category is not available, throw error
        const isAvailable = availableCategories.find(cat => cat.category === category);
        if(!isAvailable) {
            return next(new Exception(`Category ${category} is invalid.`, 401));
        }
    });

    next();
});


module.exports = mongoose.model('Product', ProductSchema);