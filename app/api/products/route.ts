import { NextRequest, NextResponse } from 'next/server';
import { Repository } from '@/lib/db/repository';
import { getAuthenticatedUser } from '@/lib/auth/jwt';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    const sort = searchParams.get('sort') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    const products = await Repository.getProducts({ search, category, sort, limit });

    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to fetch products';
    return NextResponse.json({ success: false, message: errorMsg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = getAuthenticatedUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Forbidden. Admin privileges required.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, description, price, category, stock, imageUrl, specs, featured } = body;

    if (!name || !description || price === undefined || !category || stock === undefined) {
      return NextResponse.json(
        { success: false, message: 'Missing required product fields: name, description, price, category, stock.' },
        { status: 400 }
      );
    }

    const newProduct = await Repository.createProduct({
      name,
      description,
      price: Number(price),
      category,
      stock: Number(stock),
      imageUrl: imageUrl || '/images/hero_store.jpg',
      specs: specs || {},
      featured: Boolean(featured),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Product created successfully.',
        product: newProduct,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to create product';
    return NextResponse.json({ success: false, message: errorMsg }, { status: 500 });
  }
}
