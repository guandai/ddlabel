import { v4 as uuidv4 } from 'uuid';

const COUNTRY_CODE = 'US'; // Replace with the appropriate country code

const generateRandomLetter = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return letters[Math.floor(Math.random() * letters.length)];
};

export const generateTrackingNumber = (): string => {
  const prefix = `${generateRandomLetter()}${generateRandomLetter()}`; // Two uppercase letters
  const uniqueNumber = Math.floor(Math.random() * 100000000).toString().padStart(8, '0'); // 8-digit unique number
  const trackingNumber = `${prefix}${uniqueNumber}${COUNTRY_CODE}`; // Combine to form tracking number

  return trackingNumber;
};
