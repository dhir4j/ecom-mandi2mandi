'use server';

import { getProductById } from '@/lib/products';
import type { Product } from '@/lib/types';
import { CheckoutClientPage } from '@/components/checkout-client-page';
import { notFound } from 'next/navigation';

type CheckoutPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const getFirstSearchParam = (param: string | string[] | undefined): string | undefined => {
  if (Array.isArray(param)) {
    return param[0];
  }
  return param;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const productId = getFirstSearchParam(searchParams.productId);

  if (!productId) {
    notFound();
  }

  const product = (await getProductById(productId)) || null;

  if (!product) {
    notFound();
  }

  // Flatten search params to ensure they are strings for the client component
  const flattenedSearchParams = {
    productId: getFirstSearchParam(searchParams.productId),
    quantity: getFirstSearchParam(searchParams.quantity),
    unit: getFirstSearchParam(searchParams.unit),
    totalPrice: getFirstSearchParam(searchParams.totalPrice),
    amountToPay: getFirstSearchParam(searchParams.amountToPay),
    paymentOption: getFirstSearchParam(searchParams.paymentOption),
    buyerName: getFirstSearchParam(searchParams.buyerName),
    mobile: getFirstSearchParam(searchParams.mobile),
    pincode: getFirstSearchParam(searchParams.pincode),
    addressLine1: getFirstSearchParam(searchParams.addressLine1),
    addressLine2: getFirstSearchParam(searchParams.addressLine2),
    city: getFirstSearchParam(searchParams.city),
    state: getFirstSearchParam(searchParams.state),
  }
  
  return <CheckoutClientPage product={product} searchParams={flattenedSearchParams} />;
}
