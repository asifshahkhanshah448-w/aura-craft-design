const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
      maxlength: 120,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a product description'],
      maxlength: 2000,
    },
    price: {
      type: Number,
      required: [true, 'Please add a product price'],
      min: 0,
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, 'Please specify stock quantity'],
      min: 0,
      default: 0,
    },
    imageUrl: {
      type: String,
      required: [true, 'Please provide an image URL'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    specs: {
      type: Map,
      of: String,
      default: {},
    },
    rating: {
      average: { type: Number, default: 4.8 },
      count: { type: Number, default: 12 },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
