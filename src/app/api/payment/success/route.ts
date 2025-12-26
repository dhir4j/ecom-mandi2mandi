import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const data: Record<string, string> = {};

    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    const {
      status,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      hash: receivedHash,
      key,
      mihpayid,
    } = data;

    // Verify hash
    const PAYU_SALT = process.env.PAYU_SALT || 'YOUR_SALT';
    const hashString = `${PAYU_SALT}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
    const calculatedHash = crypto.createHash('sha512').update(hashString).digest('hex');

    if (calculatedHash !== receivedHash) {
      console.error('Hash mismatch - possible tampering');
      return NextResponse.redirect(new URL('/payment/failed', request.url));
    }

    if (status === 'success') {
      // Update user subscription status
      // This should call your backend API to update the user's subscription
      const authResponse = await fetch('https://www.mandi.ramhotravels.com/api/auth/update-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          txnid,
          mihpayid,
          amount,
          hasSubscription: true,
          subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        }),
      });

      if (authResponse.ok) {
        return NextResponse.redirect(new URL('/payment/success', request.url));
      }
    }

    return NextResponse.redirect(new URL('/payment/failed', request.url));
  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.redirect(new URL('/payment/failed', request.url));
  }
}
