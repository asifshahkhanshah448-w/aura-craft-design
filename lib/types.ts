export type UserRole = 'customer' | 'admin';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
  featured?: boolean;
  specs?: Record<string, string>;
  rating?: {
    average: number;
    count: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IOrderItem {
  product: string; // product ID
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface IOrder {
  _id: string;
  orderId: string;
  user: string; // user ID
  customerName: string;
  phone: string;
  deliveryAddress: {
    street: string;
    city: string;
    postalCode: string;
  };
  items: IOrderItem[];
  paymentMethod: 'Cash on Delivery' | 'Credit / Debit Card';
  paymentStatus: 'Pending' | 'Completed';
  orderStatus: OrderStatus;
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
}
