import { NextResponse } from 'next/server';
import { ServerDataService } from '@/lib/serverDataService';

export async function GET() {
    try {
        const promotions = await ServerDataService.fetchPromotions();

        return NextResponse.json(promotions, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
            },
        });
    } catch (error) {
        console.error('Promotions API Error:', error);
        return NextResponse.json([], { status: 500 });
    }
}
