import { NextResponse } from 'next/server';
import { getDatabaseConnection } from '@/lib/db/connection';
import { Repository } from '@/lib/db/repository';

export async function GET() {
  const dbStatus = await getDatabaseConnection();
  const products = await Repository.getProducts();
  const orders = await Repository.getAllOrders();

  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'AURA Craft & Design E-Commerce API',
    database: {
      isConnected: dbStatus.isConnected,
      mode: dbStatus.mode,
      message: dbStatus.message,
      host: dbStatus.host || 'Local Storage / In-Memory (Sandbox Mode)',
    },
    metrics: {
      totalProducts: products.length,
      totalOrders: orders.length,
    },
    version: '1.0.0-internship-release',
  });
}
