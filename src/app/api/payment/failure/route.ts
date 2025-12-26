import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const data: Record<string, string> = {};

    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    console.log('Payment failed:', data);

    return NextResponse.redirect(new URL('/payment/failed', request.url));
  } catch (error) {
    console.error('Payment failure callback error:', error);
    return NextResponse.redirect(new URL('/payment/failed', request.url));
  }
}
