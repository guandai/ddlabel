// backend/src/controllers/shippingRateController.ts
import { Request, Response } from 'express';
import { ShippingRate } from '../models/ShippingRate';
import { Op } from 'sequelize';

// Function to calculate shipping rate
export const fullShippingRate = async (
  length: number,
  width: number,
  height: number,
  weight: number,
  zone: number,
  unit: string = "lbs"
): Promise<number> => {
  if (unit === "oz" && weight <= 1) {
    weight /= 16; // Convert pounds to ounces
    unit = "lbs"; // Change unit to ounces
  }

  const volumetricWeight = unit === "inch"
    ? (length * width * height) / 250
    : (length * width * height) / 9000;

  weight = Math.ceil(Math.max(volumetricWeight, weight));

  if (width > 108 || height > 108 || length > 108 ) {
    return 1000;
  }

  const shippingRates = await getShippingRatesForWeight(weight, unit);

  if (!shippingRates) {
    throw new Error(`No shipping rate found for the specified weight and zone ${weight} ${unit}`);
  }

  const rate = Number(shippingRates[`zone${zone}` as keyof ShippingRate]); // Convert rate to a number

  const pickupCharge = Math.max(125, 0.065 * weight);

  const fuelSurcharge = 0.10 * rate; // Use the converted rate

  const totalCost = rate + pickupCharge + fuelSurcharge;

  return totalCost;
}

// Function to get shipping rates for a specific weight and zone
export const getShippingRatesForWeight = async (weight: number, unit: string): Promise<ShippingRate | null> => {
  if ( weight > 150 ) {
    return {
      weightRange: '150<n=999999',
      unit: 'lbs',
      zone1: 1000,
      zone2: 1000,
      zone3: 1000,
      zone4: 1000,
      zone5: 1000,
      zone6: 1000,
      zone7: 1000,
      zone8: 1000,
    } as ShippingRate;
  }

  const data = await ShippingRate.findAll({
    where: {
      unit,
      weightRange: { [Op.regexp]: `\\d*<n=${weight}` }
    }
  });

  return data.find(row => {
    const [min, max] = row.weightRange.split('<n=').map(parseFloat);
    return weight > min && weight <= max;
  }) || null;
}

export const getShippingRates = async (req: Request, res: Response) => {
  try {
    const rates = await ShippingRate.findAll();
    res.json(rates);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getSimpleRate = async (req: Request, res: Response) => {
  const { unit, weight } = req.query;

  if (!unit || !weight) {
    return res.status(400).json({ message: 'Unit and weight are required' });
  }

  try {
    const weightNum = parseFloat(weight as string);
    const rates = await getShippingRatesForWeight(weightNum, unit as string);

    if (!rates) {
      return res.status(404).json({ message: `can not getrate for  ${weightNum} and ${unit}` });
    }

    res.json(rates);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export const getFullRate = async (req: Request, res: Response) => {
  const { length, width, height, weight, zone, unit } = req.query;

  if (!length || !width || !height || !weight || !zone || !unit) {
    return res.status(400).json({ message: 'All parameters are required: length, width, height, weight, zone, unit' });
  }

  try {
    const lengthNum = parseFloat(length as string);
    const widthNum = parseFloat(width as string);
    const heightNum = parseFloat(height as string);
    const weightNum = parseFloat(weight as string);
    const zoneNum = parseInt(zone as string, 10);

    const totalCost = await fullShippingRate(lengthNum, widthNum, heightNum, weightNum, zoneNum, unit as string);
    res.json({ totalCost });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

