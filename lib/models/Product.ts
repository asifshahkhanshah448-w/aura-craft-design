import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProductDocument extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
  featured: boolean;
  specs: Record<string, string>;
  rating: {
    average: number;
    count: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProductDocument>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      maxlength: [120, 'Product name cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a product price'],
      min: [0, 'Price must be positive'],
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, 'Please specify inventory stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    imageUrl: {
      type: String,
      required: [true, 'Please provide a product image URL'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    specs: {
      type: Schema.Types.Mixed,
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

export const ProductModel: Model<IProductDocument> =
  mongoose.models.Product || mongoose.model<IProductDocument>('Product', ProductSchema);

export default ProductModel;
