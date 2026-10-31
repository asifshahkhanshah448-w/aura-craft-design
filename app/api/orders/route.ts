import { NextRequest, NextResponse } from 'next/server';
import { Repository } from '@/lib/db/repository';
import { getAuthenticatedUser } from '@/lib/auth/jwt';

export async function POST(req: NextRequest) {
  try {
    const authUser = getAuthenticatedUser(req);
    const body = await req.json();
    const { customerName, phone, deliveryAddress, items, paymentMethod } = body;

    // Validate request body
    if (!customerName || !phone || !deliveryAddress || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please provide customerName, phone, deliveryAddress (street, city, postalCode), and at least one item.',
        },
        { status: 400 }
      );
    }

    if (!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.postalCode) {
      return NextResponse.json(
        {
          success: false,
          message: 'Complete delivery address is required: street, city, and postal code.',
        },
        { status: 400 }
      );
    }

    // Determine user ID: from JWT if authenticated, or a guest user id
    const userId = authUser ? authUser.id : `guest_${Date.now()}`;

    // Execute order creation with server-side pricing and atomic inventory deduction
    const result = await Repository.createOrder({
      userId,
      customerName,
      phone,
      deliveryAddress,
      items,
      paymentMethod,
    });

    if (result.error || !result.order) {
      return NextResponse.json(
        { success: false, message: result.error || 'Failed to place order.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Order placed successfully. Thank you for shopping with AURA!',
        order: result.order,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Order processing failed';
    return NextResponse.json({ success: false, message: errorMsg }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const authUser = getAuthenticatedUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Forbidden. Admin privileges required to view all orders.' },
        { status: 403 }
      );
    }

    const orders = await Repository.getAllOrders();

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to retrieve orders';
    return NextResponse.json({ success: false, message: errorMsg }, { status: 500 });
  }
}
