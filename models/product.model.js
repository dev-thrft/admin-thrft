const mongoose = require('mongoose');   

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
            cat: {
                type: String,
                required: [
                    true,
                    'Product category must be set.'
                ],
                trim: true,
                minlength: 3,
                maxlength: 32,
                alias: 'category'
            },
        }
    ],
    imgs: [
        {
            type: new mongoose.Schema({
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
            }),
            alias: 'images'
        }
    ],
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

module.exports = mongoose.model('Product', ProductSchema);