// Shipping Cost Calculation Utility
// Based on realistic Indian agricultural logistics pricing

// Constants - Can be updated from backend API or database
const INTRA_STATE_RATE_ROAD = 1.0;  // ₹/kg (midpoint: 0.5-1.5)
const INTRA_STATE_RATE_RAIL = 0.55; // ₹/kg (midpoint: 0.3-0.8)
const INTER_STATE_RATE_ROAD = 2.25; // ₹/kg (midpoint: 1.5-3.0)
const INTER_STATE_RATE_RAIL = 1.3;  // ₹/kg (midpoint: 0.8-1.8)
const ROAD_WEIGHT = 0.7;            // 70% weightage for road (agri-dominant mode)
const RAIL_WEIGHT = 0.3;            // 30% for rail
const PERISHABLE_UPLIFT = 1.25;     // +25% for fruits/veg (reefer/cold storage)
const MIN_CHARGE = 50;              // Minimum ₹50/order
const TIER_BREAKS = [0, 10, 50];    // kg thresholds for progressive discount
const TIER_DISCOUNTS = [1.0, 0.95, 0.85]; // Multipliers: full rate, -5%, -15%

// Minimum order value (inclusive of shipping)
export const MIN_ORDER_VALUE = 3000; // ₹3000 minimum order

// Perishable categories (typically need refrigerated transport)
const PERISHABLE_CATEGORIES = [
  'vegetables',
  'fruits',
  'dairy',
  'meat',
  'fish',
  'flowers'
];

// Unit conversion: 20 pieces of eggs = 1 kg
export function convertToKg(quantity: number, unit: string): number {
  const normalizedUnit = unit.toLowerCase().trim();

  if (normalizedUnit === 'kg' || normalizedUnit === 'kilogram') {
    return quantity;
  } else if (normalizedUnit === 'piece' || normalizedUnit === 'pieces' || normalizedUnit === 'pcs') {
    // For eggs: 20 pieces = 1 kg
    return quantity / 20;
  } else if (normalizedUnit === 'gram' || normalizedUnit === 'g') {
    return quantity / 1000;
  } else if (normalizedUnit === 'quintal' || normalizedUnit === 'q') {
    return quantity * 100;
  } else if (normalizedUnit === 'ton' || normalizedUnit === 'tonne' || normalizedUnit === 't') {
    return quantity * 1000;
  }

  // Default: treat as kg
  return quantity;
}

// Check if product category is perishable
export function isPerishableCategory(category: string): boolean {
  const normalizedCategory = category.toLowerCase().trim();
  return PERISHABLE_CATEGORIES.some(cat => normalizedCategory.includes(cat));
}

export interface ShippingCalculation {
  success: boolean;
  charge: number;
  error?: string;
  breakdown?: {
    weightInKg: number;
    baseRatePerKg: number;
    tierMultiplier: number;
    isIntraState: boolean;
    isPerishable: boolean;
    estimatedMode: string;
    discountApplied: number;
    rawCharge: number;
  };
}

/**
 * Calculate shipping charge based on weight, location, and product type
 * @param weight - Weight of the product in the specified unit
 * @param unit - Unit of measurement (kg, piece, etc.)
 * @param fromState - Seller's state
 * @param toState - Buyer's state
 * @param category - Product category (to determine if perishable)
 * @returns ShippingCalculation object with charge and breakdown
 */
export function calculateShippingCharge(
  weight: number,
  unit: string,
  fromState: string,
  toState: string,
  category: string = ''
): ShippingCalculation {
  // Step 1: Input Validation
  if (weight <= 0) {
    return { error: "Weight must be greater than 0", charge: 0, success: false };
  }

  // Convert to kg
  const weightInKg = convertToKg(weight, unit);

  if (weightInKg > 10000) {  // Max 10 tons for sanity
    return { error: "Weight exceeds maximum limit (10 tons)", charge: 0, success: false };
  }

  if (!fromState || !toState) {
    return { error: "Missing location information", charge: 0, success: false };
  }

  // Step 2: Determine Intra/Inter-State
  const isIntraState = fromState.toLowerCase().trim() === toState.toLowerCase().trim();
  let baseRatePerKg: number;

  if (isIntraState) {
    // Average Intra-State Rate (weighted)
    baseRatePerKg = (ROAD_WEIGHT * INTRA_STATE_RATE_ROAD) + (RAIL_WEIGHT * INTRA_STATE_RATE_RAIL);
  } else {
    // Average Inter-State Rate (weighted)
    baseRatePerKg = (ROAD_WEIGHT * INTER_STATE_RATE_ROAD) + (RAIL_WEIGHT * INTER_STATE_RATE_RAIL);
  }

  // Step 3: Apply Perishable Uplift if Needed
  const isPerishable = isPerishableCategory(category);
  if (isPerishable) {
    baseRatePerKg *= PERISHABLE_UPLIFT;
  }

  // Step 4: Apply Weight-Based Tier Discount (progressive)
  let tierMultiplier = 1.0;
  let discountApplied = 0;

  for (let i = 0; i < TIER_BREAKS.length; i++) {
    if (weightInKg > TIER_BREAKS[i]) {
      tierMultiplier = TIER_DISCOUNTS[i];
      discountApplied = (1 - tierMultiplier) * 100;
    }
  }

  const discountedRatePerKg = baseRatePerKg * tierMultiplier;

  // Step 5: Calculate Total Charge
  let totalCharge = weightInKg * discountedRatePerKg;
  const rawCharge = totalCharge;
  totalCharge = Math.max(totalCharge, MIN_CHARGE);  // Enforce min charge

  // Step 6: Round to nearest rupee
  totalCharge = Math.round(totalCharge);

  // Step 7: Return Result
  return {
    success: true,
    charge: totalCharge,
    breakdown: {
      weightInKg: Math.round(weightInKg * 100) / 100,
      baseRatePerKg: Math.round(baseRatePerKg * 100) / 100,
      tierMultiplier,
      isIntraState,
      isPerishable,
      estimatedMode: isIntraState ? "Road Transport" : "Road/Rail Mix",
      discountApplied,
      rawCharge: Math.round(rawCharge)
    }
  };
}

/**
 * Validate if order meets minimum order value requirement
 * @param productPrice - Total price of products
 * @param shippingCharge - Calculated shipping charge
 * @returns Object indicating if order is valid and how much more is needed
 */
export function validateMinimumOrder(productPrice: number, shippingCharge: number): {
  isValid: boolean;
  totalValue: number;
  shortfall: number;
  message?: string;
} {
  const totalValue = productPrice + shippingCharge;
  const shortfall = Math.max(0, MIN_ORDER_VALUE - totalValue);

  if (totalValue < MIN_ORDER_VALUE) {
    return {
      isValid: false,
      totalValue,
      shortfall,
      message: `Minimum order value is ₹${MIN_ORDER_VALUE.toLocaleString('en-IN')}. Please add ₹${shortfall.toLocaleString('en-IN')} more to proceed.`
    };
  }

  return {
    isValid: true,
    totalValue,
    shortfall: 0
  };
}

/**
 * Format shipping breakdown for display
 */
export function formatShippingBreakdown(calculation: ShippingCalculation): string {
  if (!calculation.success || !calculation.breakdown) {
    return 'Unable to calculate shipping';
  }

  const { breakdown } = calculation;
  let text = `${breakdown.weightInKg}kg via ${breakdown.estimatedMode}`;

  if (breakdown.isPerishable) {
    text += ' (Refrigerated)';
  }

  if (breakdown.discountApplied > 0) {
    text += ` • ${breakdown.discountApplied}% bulk discount`;
  }

  return text;
}
