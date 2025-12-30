import { NextResponse } from 'next/server';
import { ServerDataService } from '@/lib/serverDataService';

export async function GET() {
  try {
    const products = await ServerDataService.fetchProducts();

    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    // ServerDataService.fetchProducts() already handles errors by returning demo data
    // but we add an extra layer of safety here
    return NextResponse.json([], { status: 500 });
  }
}

