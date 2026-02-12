const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true }
    }],
    total: { type: Number, required: true, min: 0 },
    customerInfo: {
        name: String,
        email: String,
        address: String
    },
    status: { type: String, default: 'pending', enum: ['pending', 'completed', 'cancelled'] }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
