import { NextRequest, NextResponse } from 'next/server';
import { Repository } from '@/lib/db/repository';
import { getAuthenticatedUser } from '@/lib/auth/jwt';
import { OrderStatus } from '@/lib/types';

const ALLOWED_STATUSES: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = getAuthenticatedUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Forbidden. Admin privileges required.' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid order status. Allowed values: ${ALLOWED_STATUSES.join(', ')}`,
        },
        { status: 400 }
      );
    }

    const updatedOrder = await Repository.updateOrderStatus(id, status as OrderStatus);

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, message: 'Order not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Order status updated to "${status}".`,
      order: updatedOrder,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to update order status';
    return NextResponse.json({ success: false, message: errorMsg }, { status: 500 });
  }
}
