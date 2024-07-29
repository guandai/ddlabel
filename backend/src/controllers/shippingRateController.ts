// backend/src/controllers/shippingRateController.ts
import { Request, Response } from 'express';
import { ShippingRate } from '../models/ShippingRate';
import { Op } from 'sequelize';

type WeightUnit = 'lbs' | 'oz';
type VolumeUnit = 'inch' | 'mm';

type FullRateProp = {
  weight: number;
  weightUnit: WeightUnit;
  length: number;
  width: number;
  height: number;
  volumeUnit: VolumeUnit;
  zone: number;
};
// Function to calculate shipping rate
export const fullShippingRate = async (prop: FullRateProp): Promise<number | 'NO_RATE'> => {
  let { weight, weightUnit, length, width, height, volumeUnit, zone } = prop;
  if (width > 108 || height > 108 || length > 108) {
    return 1000;
  }

  if (weight <= 1) {
    weight /= 16; // Convert pounds to ounces
    weightUnit = "oz"; // Change unit to ounces
  }

  const volumetricWeight = volumeUnit === "inch"
    ? (length * width * height) / 250   // inch
    : (length * width * height) / 9000;  // mm

  weight = Math.ceil(Math.max(volumetricWeight, weight));


  const shippingRates = await getShippingRatesForWeight(weight, weightUnit);

  if (!shippingRates) {
    return 'NO_RATE';
  }

  const rate = Number(shippingRates[`zone${zone}` as keyof ShippingRate]); // Convert rate to a number

  const pickupCharge = Math.max(125, 0.065 * weight);

  const fuelSurcharge = 0.10 * rate; // Use the converted rate

  const totalCost = rate + pickupCharge + fuelSurcharge;

  return totalCost;
}

// Function to get shipping rates for a specific weight and zone
export const getShippingRatesForWeight = async (weight: number, unit: string): Promise<ShippingRate | null> => {
  if (weight > 150) {
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
      weightRange: { [Op.eq]: `${weight-1}<n=${weight}` }
    }
  });
  console.log(`ShippingRate find data`, data);
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

export const getFullRate = async (req: Request, res: Response) => {
  let { length, width, height, weight, zone, weightUnit, volumeUnit } = req.query;

  if (!length || !width || !height || !weight || !zone || !weightUnit || !volumeUnit) {
    return res.status(400).json({ message: 'All parameters are required: length, width, height, weight, zone, weightUnit, volumeUnit' });
  }
  
  try {
    const param = {
      length: Math.ceil(parseFloat(length as string)),
      width: Math.ceil(parseFloat(width as string)),
      height: Math.ceil(parseFloat(height as string)),
      weight: Math.ceil(parseFloat(weight as string)),
      zone: parseInt(zone as string, 10),
      weightUnit: weightUnit as WeightUnit,
      volumeUnit: volumeUnit as VolumeUnit,
    };

    const totalCost = await fullShippingRate(param);
    if (!totalCost) {
      return res.status(204).json({ totalCost: -1, message: `No shipping rate found for the specified weight and zone ${weight} ${weightUnit}` });
    };
    res.json({ totalCost });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

