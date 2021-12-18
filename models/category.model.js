const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    cat: {
        type: String,
        required: [
            true,
            'Category name is required.'
        ],
        lowercase: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 32,
        alias: 'category'
    }   
});

module.exports = mongoose.model('Category', CategorySchema);