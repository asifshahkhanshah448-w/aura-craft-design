import mongoose, { Schema, Document, Model } from 'mongoose';
import { OrderStatus } from '../types';

export interface IOrderDocument extends Document {
  orderId: string;
  user: mongoose.Types.ObjectId;
  customerName: string;
  phone: string;
  deliveryAddress: {
    street: string;
    city: string;
    postalCode: string;
  };
  items: {
    product: mongoose.Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }[];
  paymentMethod: 'Cash on Delivery' | 'Credit / Debit Card';
  paymentStatus: 'Pending' | 'Completed';
  orderStatus: OrderStatus;
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrderDocument>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Delivery contact phone is required'],
      trim: true,
    },
    deliveryAddress: {
      street: { type: String, required: [true, 'Street address is required'] },
      city: { type: String, required: [true, 'City is required'] },
      postalCode: { type: String, required: [true, 'Postal code is required'] },
    },
    items: {
      type: [OrderItemSchema],
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['Cash on Delivery', 'Credit / Debit Card'],
      default: 'Cash on Delivery',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed'],
      default: 'Pending',
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
      index: true,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const OrderModel: Model<IOrderDocument> =
  mongoose.models.Order || mongoose.model<IOrderDocument>('Order', OrderSchema);

export default OrderModel;
