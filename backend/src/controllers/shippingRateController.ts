// backend/src/controllers/shippingRateController.ts
import { Request, Response } from 'express';
import { ShippingRate } from '../models/ShippingRate';
import { Op } from 'sequelize';
import { get } from 'mongoose';

// Function to calculate shipping rate
export const calculateShippingRate = async (
  length: number,
  width: number,
  height: number,
  actualWeight: number,
  zone: number,
  unit: string = "lbs"
): Promise<number> => {
  if (unit === "oz" && actualWeight <= 1) {
    actualWeight /= 16; // Convert pounds to ounces
    unit = "lbs"; // Change unit to ounces
  }

  const volumetricWeight = unit === "inch"
    ? (length * width * height) / 250
    : (length * width * height) / 9000;

  const weight = Math.ceil(Math.max(volumetricWeight, actualWeight));

  const shippingRates = await getShippingRatesForWeight(weight, unit);

  if (!shippingRates) {
    throw new Error("No shipping rate found for the specified weight and zone");
  }

  const rate = Number(shippingRates[`zone${zone}` as keyof ShippingRate]); // Convert rate to a number

  const pickupCharge = Math.max(125, 0.065 * weight);

  const fuelSurcharge = 0.10 * rate; // Use the converted rate

  const totalCost = rate + pickupCharge + fuelSurcharge;

  return totalCost;
}

// Function to get shipping rates for a specific weight and zone
export const getShippingRatesForWeight = async (weight: number, unit: string): Promise<ShippingRate | null> => {
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

export const getRate = async (req: Request, res: Response) => {
  const { unit, weight } = req.query;

  if (!unit || !weight) {
    return res.status(400).json({ message: 'Unit and weight are required' });
  }

  try {
    const weightNum = parseFloat(weight as string);
    const rates = await getShippingRatesForWeight(weightNum, unit as string);

    if (!rates) {
      return res.status(404).json({ message: 'No rates found for the specified weight and unit' });
    }

    res.json(rates);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export const getCalculateRate = async (req: Request, res: Response) => {
  const { length, width, height, actualWeight, zone, unit } = req.query;

  if (!length || !width || !height || !actualWeight || !zone || !unit) {
    return res.status(400).json({ message: 'All parameters are required: length, width, height, actualWeight, zone, unit' });
  }

  try {
    const lengthNum = parseFloat(length as string);
    const widthNum = parseFloat(width as string);
    const heightNum = parseFloat(height as string);
    const actualWeightNum = parseFloat(actualWeight as string);
    const zoneNum = parseInt(zone as string, 10);

    const totalCost = await calculateShippingRate(lengthNum, widthNum, heightNum, actualWeightNum, zoneNum, unit as string);
    res.json({ totalCost });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

