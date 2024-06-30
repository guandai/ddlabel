// backend/src/controllers/shippingRateController.ts
import { Request, Response } from 'express';
import { ShippingRate } from '../models/ShippingRate';

// Function to calculate shipping rate
export function calculateShippingRate(
  length: number,
  width: number,
  height: number,
  actualWeight: number,
  zone: number,
  unit: string = "lbs"
): number {
  const volumetricWeight = unit === "inch"
    ? (length * width * height) / 250
    : (length * width * height) / 9000;

  const billingWeight = Math.ceil(Math.max(volumetricWeight, actualWeight));

  const shippingRates = getShippingRatesForWeight(billingWeight, zone, unit);

  if (!shippingRates) {
    throw new Error("No shipping rate found for the specified weight and zone");
  }

  const rate = Number(shippingRates[`zone${zone}` as keyof ShippingRate]); // Convert rate to a number

  const pickupCharge = Math.max(125, 0.065 * billingWeight);

  const fuelSurcharge = 0.10 * rate; // Use the converted rate

  const totalCost = rate + pickupCharge + fuelSurcharge;

  return totalCost;
}

// Function to get shipping rates for a specific weight and zone
export function getShippingRatesForWeight(weight: number, zone: number, unit: string): ShippingRate | undefined {
  const data: ShippingRate[] = [
    // Sample data
    { weightRange: '1<n=2', unit: 'lbs', zone1: 5.25, zone2: 5.25, zone3: 5.25, zone4: 6.13, zone5: 7.00, zone6: 7.88, zone7: 7.88, zone8: 8.76 } as ShippingRate,
    // Add more rows as necessary
  ];

  return data.find(row => {
    const [min, max] = row.weightRange.split('<n=').map(parseFloat);
    return weight > min && weight <= max && row.unit === unit;
  });
}

// Example usage
// try {
//   const totalCost = calculateShippingRate(12, 8, 4, 1.3, 3, "inch");
//   console.log(`Total Shipping Cost: $${totalCost.toFixed(2)}`);
// } catch (error) {
//   console.error(error.message);
// }

export const getShippingRates = async (req: Request, res: Response) => {
  try {
    const rates = await ShippingRate.findAll();
    res.json(rates);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
