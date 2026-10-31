import { NextRequest, NextResponse } from 'next/server';
import { Repository } from '@/lib/db/repository';
import { getAuthenticatedUser } from '@/lib/auth/jwt';

export async function GET(req: NextRequest) {
  try {
    const authUser = getAuthenticatedUser(req);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: 'Authentication required to view your order history.' },
        { status: 401 }
      );
    }

    const orders = await Repository.getMyOrders(authUser.id);

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to retrieve your orders';
    return NextResponse.json({ success: false, message: errorMsg }, { status: 500 });
  }
}
