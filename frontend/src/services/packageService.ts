// src/services/packageService.ts
import axios from 'axios';

console.log(`process.env.REACT_APP_LOCAL_BACKEND`, process.env);
//const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5100/api/packages';
console.log(`process.env.REACT_APP_LOCAL_BACKEND`, process.env.REACT_APP_LOCAL_BACKEND);
const API_URL = process.env.REACT_APP_LOCAL_BACKEND ? 'http://localhost:5100/api/packages' : process.env.REACT_APP_API_URL || '//track.loadsmobile.com/api/packages';
console.log(`API_URL`, API_URL);

interface Package {
  id: number;
  name: string;
}

export const getPackages = async (): Promise<Package[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addPackage = async (pkg: Omit<Package, 'id'>): Promise<Package> => {
  const response = await axios.post(API_URL, pkg);
  return response.data;
};

export const removePackage = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};

export const updatePackage = async (pkg: Package): Promise<Package> => {
  const response = await axios.put(`${API_URL}/${pkg.id}`, pkg);
  return response.data;
};
