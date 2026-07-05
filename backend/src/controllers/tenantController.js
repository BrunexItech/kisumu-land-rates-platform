import { tenants } from '../data/seedData.js';

export const getTenants = (req, res) => {
  res.json(tenants);
};

export const getTenantStats = (req, res) => {
  const total = tenants.length;
  const rentRoll = tenants.reduce((s, t) => s + t.monthlyRent, 0);
  const arrearsCount = tenants.filter(t => t.rentStatus === 'arrears').length;
  const totalArrears = tenants.reduce((s, t) => s + t.rentArrears, 0);
  
  res.json({ total, rentRoll, arrearsCount, totalArrears });
};

export const createTenant = (req, res) => {
  const { fullName, nationalId, phone, propertyId, unitLabel, monthlyRent } = req.body;
  
  if (!fullName || !propertyId || !monthlyRent) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const newTenant = {
    id: 'TEN-' + Math.random().toString(36).slice(2, 7).toUpperCase(),
    fullName,
    nationalId: nationalId || '',
    phone: phone || '',
    kraPin: '',
    propertyId,
    buildingName: 'Building Name',
    unitLabel: unitLabel || 'Unit 1',
    monthlyRent,
    leaseStart: new Date(),
    rentStatus: 'current',
    rentArrears: 0
  };
  
  tenants.push(newTenant);
  res.status(201).json(newTenant);
};