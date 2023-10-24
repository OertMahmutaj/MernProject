const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Product name is required"] },
    description: { type: String, required: [true, "Product description is required"] },
    price: {
        type: Number,
        required: [true, "Product price is required"],
        min: [1, "Price must be greater than 0"],
    },
    createdBy: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
