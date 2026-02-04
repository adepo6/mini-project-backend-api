const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'], // Requirement: Name required 
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price must be a positive number'] // Requirement: Price positive 
    },
    stock: {
        type: Number,
        required: true,
        min: [0, 'Stock cannot be negative'], // Requirement: Stock non-negative 
        default: 0
    },
    category: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);