import { NextRequest, NextResponse } from 'next/server';
import { Repository } from '@/lib/db/repository';
import { getAuthenticatedUser } from '@/lib/auth/jwt';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await Repository.getOrderById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found.' },
        { status: 404 }
      );
    }

    const authUser = getAuthenticatedUser(req);
    // Allow if user is admin, or is the owner of the order, or if guest lookup with matching order ID
    if (authUser) {
      if (authUser.role !== 'admin' && order.user !== authUser.id) {
        return NextResponse.json(
          { success: false, message: 'Forbidden. You do not have permission to view this order.' },
          { status: 403 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to retrieve order';
    return NextResponse.json({ success: false, message: errorMsg }, { status: 500 });
  }
}
