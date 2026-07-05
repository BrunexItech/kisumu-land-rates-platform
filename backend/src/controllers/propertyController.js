import { properties, payments } from '../data/seedData.js';

export const getProperties = (req, res) => {
  let result = [...properties];
  
  const { search, subcounty, ward, type, status, occupancy } = req.query;
  
  if (search) {
    const s = search.toLowerCase();
    result = result.filter(p => 
      p.id.toLowerCase().includes(s) ||
      (p.titleNumber && p.titleNumber.toLowerCase().includes(s)) ||
      p.buildingName.toLowerCase().includes(s) ||
      p.owner.toLowerCase().includes(s) ||
      p.plotNumber.toLowerCase().includes(s)
    );
  }
  if (subcounty) result = result.filter(p => p.subcounty === subcounty);
  if (ward) result = result.filter(p => p.ward === ward);
  if (type) result = result.filter(p => p.useType === type);
  if (status) result = result.filter(p => p.status === status);
  if (occupancy) result = result.filter(p => p.occupancyStatus === occupancy);
  
  res.json(result);
};

export const getProperty = (req, res) => {
  const property = properties.find(p => p.id === req.params.id);
  if (!property) {
    return res.status(404).json({ message: 'Property not found' });
  }
  res.json(property);
};

export const createProperty = (req, res) => {
  const { owner, ownerCategory, buildingName, subcounty, ward, street, plotNumber, titleNumber, useType, unitCount, occupancyStatus } = req.body;
  
  if (!owner || !buildingName || !subcounty || !ward || !useType) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const buildingClasses = [
    { id: 'res-apartment', label: 'Residential Apartment', group: 'Residential', rate: 2800 },
    { id: 'standalone-house', label: 'Standalone House', group: 'Residential', rate: 3500 },
    { id: 'maisonette', label: 'Maisonette', group: 'Residential', rate: 4200 },
    { id: 'office-block', label: 'Office Block', group: 'Commercial', rate: 6500 },
    { id: 'shop', label: 'Shop', group: 'Commercial', rate: 4000 },
    { id: 'mall', label: 'Mall', group: 'Commercial', rate: 18000 },
    { id: 'market-stall', label: 'Market Stall', group: 'Commercial', rate: 1500 },
    { id: 'hotel', label: 'Hotel', group: 'Hospitality', rate: 15000 },
    { id: 'guesthouse', label: 'Guest House', group: 'Hospitality', rate: 6500 },
    { id: 'serviced-apartment', label: 'Serviced Apartment', group: 'Hospitality', rate: 8500 },
    { id: 'warehouse', label: 'Warehouse', group: 'Industrial', rate: 7000 },
    { id: 'factory', label: 'Factory', group: 'Industrial', rate: 9500 },
    { id: 'workshop', label: 'Workshop', group: 'Industrial', rate: 4500 },
    { id: 'school', label: 'School', group: 'Institutional', rate: 5000 },
    { id: 'university', label: 'University', group: 'Institutional', rate: 22000 },
    { id: 'clinic', label: 'Clinic', group: 'Institutional', rate: 5000 },
    { id: 'hospital', label: 'Hospital', group: 'Institutional', rate: 14000 },
    { id: 'mixed-use', label: 'Mixed-Use Building', group: 'Other', rate: 7800 },
    { id: 'institution', label: 'Institution', group: 'Other', rate: 6000 }
  ];
  
  const cls = buildingClasses.find(c => c.id === useType);
  const baseRate = cls ? cls.rate : 3000;
  const units = unitCount || 1;
  const assessedAmount = baseRate * (units > 1 ? Math.ceil(units / 3) : 1);

  const subcountyCentres = {
    'Kisumu East': [-0.0850, 34.8100],
    'Kisumu West': [-0.0750, 34.6950],
    'Kisumu Central': [-0.0950, 34.7600],
    'Seme': [-0.0500, 34.6200],
    'Nyando': [-0.1750, 34.9300],
    'Muhoroni': [-0.1450, 35.1900],
    'Nyakach': [-0.3100, 34.9500]
  };
  
  const centre = subcountyCentres[subcounty] || [-0.0917, 34.7680];
  const lat = centre[0] + (Math.random() - 0.5) * 0.06;
  const lng = centre[1] + (Math.random() - 0.5) * 0.06;

  const newProperty = {
    id: 'KSM-P-' + String(properties.length + 1).padStart(5, '0'),
    county: 'Kisumu',
    subcounty,
    ward,
    street: street || `${ward} Road`,
    buildingName,
    plotNumber: plotNumber || `KSM/${subcounty.split(' ')[0].slice(0, 3).toUpperCase()}/${Math.floor(Math.random() * 900) + 100}`,
    titleNumber: titleNumber || null,
    owner,
    ownerCategory: ownerCategory || 'Individual',
    useType,
    unitCount: units,
    occupancyStatus: occupancyStatus || 'Occupied',
    estimatedAnnualValue: assessedAmount * 10,
    assessedAmount,
    arrears: assessedAmount,
    paidToDate: 0,
    lat,
    lng,
    isMapped: true,
    status: 'pending',
    riskScore: Math.floor(Math.random() * 25) + 15,
    registeredAt: new Date(),
    dueDate: new Date(Date.now() + 30 * 86400000),
    lastInspection: null,
    noticeServed: false,
    paymentPlan: false,
    iprsStatus: 'not_connected',
    ardhiSasaStatus: titleNumber ? 'not_connected' : 'no_title_on_file',
    manualOverride: false
  };

  properties.push(newProperty);
  res.status(201).json(newProperty);
};

export const getDashboardData = (req, res) => {
  const total = properties.length;
  const mapped = properties.filter(p => p.isMapped).length;
  const compliant = properties.filter(p => p.status === 'compliant').length;
  const overdue = properties.filter(p => p.status === 'overdue').length;
  const totalArrears = properties.reduce((s, p) => s + p.arrears, 0);
  const revenueCollected = payments.reduce((s, p) => s + p.amount, 0);
  const complianceRate = total ? Math.round((compliant / total) * 100) : 0;
  const auditFlags = properties.filter(p => p.riskScore > 60).length;

  const revenueBySubcounty = {};
  properties.forEach(p => {
    revenueBySubcounty[p.subcounty] = (revenueBySubcounty[p.subcounty] || 0) + p.paidToDate;
  });

  const complianceByType = {};
  properties.forEach(p => {
    const key = p.status === 'compliant' ? 'Compliant' : p.status === 'overdue' ? 'Overdue' : p.status === 'pending' ? 'Pending' : 'Unmapped';
    complianceByType[key] = (complianceByType[key] || 0) + 1;
  });

  const sortedByRevenue = Object.entries(revenueBySubcounty)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const sortedByCompliance = Object.entries(complianceByType)
    .map(([name, value]) => ({ name, value }));

  res.json({
    totalProperties: total,
    mappedProperties: mapped,
    compliantProperties: compliant,
    overdueProperties: overdue,
    totalArrears,
    revenueCollected,
    complianceRate,
    auditFlags,
    properties: properties.slice(0, 10),
    revenueBySubcounty: sortedByRevenue,
    complianceByType: sortedByCompliance
  });
};

export const getOwnerProperties = (req, res) => {
  res.json(properties.slice(0, 3));
};