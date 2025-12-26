import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { txnid, amount, productinfo, firstname, email, phone, surl, furl } = body;

    // Get cookies from the incoming request to forward to backend
    const cookieHeader = request.headers.get('cookie');

    console.log('Payment initiate - forwarding cookies:', cookieHeader ? 'present' : 'missing');

    // Call backend to get PayU credentials and generate hash
    const backendUrl = 'https://www.mandi.ramhotravels.com/api/get-payu-hash';

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Forward cookies if present
    if (cookieHeader) {
      headers['Cookie'] = cookieHeader;
    }

    console.log('Calling backend:', backendUrl);

    const hashResponse = await fetch(backendUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        txnid,
        amount,
        productinfo,
        firstname,
        email,
      }),
    });

    console.log('Backend response status:', hashResponse.status);

    if (!hashResponse.ok) {
      const errorText = await hashResponse.text();
      console.error('Backend error:', errorText);
      throw new Error(`Backend returned ${hashResponse.status}: ${errorText}`);
    }

    const hashData = await hashResponse.json();
    console.log('Successfully received hash from backend');

    return NextResponse.json({
      hash: hashData.hash,
      payuUrl: hashData.payuUrl,
      merchantKey: hashData.merchantKey,
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}
