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
    images: [
        new mongoose.Schema({
            title: {
                type: String,
                required: true
            },
            src: {
                type: String,
                required: true
            }
        })
    ],
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
    collection: 'products-archive'
});


module.exports = mongoose.model('ProductArchive', ProductSchema);