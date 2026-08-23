export type AuroraDiscountPercent =
  30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40;

function stableHash(value: string): number {
  let hash = 0;

  for (let index = 0; index < value.length; index++) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
}

/**
 * Aurora pricing model
 *
 * vehicles.price remains the authoritative market/reference price.
 *
 * Aurora Access Price is derived from that market price.
 *
 * Distribution:
 * 60% -> 40% discount
 * 30% -> 35-39% discount
 * 10% -> 30-34% discount
 *
 * The vehicle ID makes the assignment stable without creating
 * another pricing source of truth in the database.
 */
export function getAuroraDiscountPercent(
  vehicleId: string,
): AuroraDiscountPercent {
  const bucket = stableHash(vehicleId) % 10;

  // 60% of vehicles
  if (bucket < 6) {
    return 40;
  }

  // 30% of vehicles
  const middleRange: AuroraDiscountPercent[] = [35, 36, 37, 38, 39];

  if (bucket < 9) {
    return middleRange[
      stableHash(`${vehicleId}:middle`) % middleRange.length
    ] as AuroraDiscountPercent;
  }

  // 10% of vehicles
  const lowerRange: AuroraDiscountPercent[] = [30, 31, 32, 33, 34];

  return lowerRange[
    stableHash(`${vehicleId}:lower`) % lowerRange.length
  ] as AuroraDiscountPercent;
}

export function getAuroraAccessPrice(
  marketPrice: number | null | undefined,
  vehicleId: string,
): number | null {
  if (
    marketPrice == null ||
    !Number.isFinite(Number(marketPrice)) ||
    Number(marketPrice) <= 0
  ) {
    return null;
  }

  const price = Number(marketPrice);
  const discount = getAuroraDiscountPercent(vehicleId);

  return Math.round(price * (1 - discount / 100));
}

export function getAuroraPricing(
  marketPrice: number | null | undefined,
  vehicleId: string,
) {
  const accessPrice = getAuroraAccessPrice(marketPrice, vehicleId);

  if (accessPrice == null || marketPrice == null) {
    return {
      marketPrice: marketPrice == null ? null : Number(marketPrice),
      auroraAccessPrice: null,
      discountPercent: null,
      savings: null,
    };
  }

  const numericMarketPrice = Number(marketPrice);

  return {
    marketPrice: numericMarketPrice,
    auroraAccessPrice: accessPrice,
    discountPercent: getAuroraDiscountPercent(vehicleId),
    savings: numericMarketPrice - accessPrice,
  };
}
