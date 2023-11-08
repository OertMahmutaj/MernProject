const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required.'],
    unique: true,
  },
  manufacturer: {
    type: String,
    required: [true, 'Manufacturer is required.'],
  },
  description: {
    type: String,
    required: [true, 'Product description is required.'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required.'],
  },
  diseaseType: {
    type: String,
    required: [true, 'Disease type is required.'],
  },
  productImage: {
    type: Array,
    required: [true, "Product Images are required"],
    default: [],
},
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      rating: {
        type: Number,
        required: [true, 'Rating is required.'],
      },
      comment: {
        type: String,
        required: [true, 'Comment is required.'],
      },
    },
  ],
});

productSchema.virtual('averageRating').get(function () {
  if (this.reviews.length === 0) {
    return 0;
  }

  const totalRating = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  return totalRating / this.reviews.length;
});

productSchema.index({ diseaseType: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
