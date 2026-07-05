import { v4 as uuidv4 } from 'uuid';

// In-memory data stores
export let properties = [];
export let payments = [];
export let auditLog = [];
export let tenants = [];
export let users = [];

const SUBCOUNTIES = {
  'Kisumu East': ['Kajulu', 'Kolwa East', 'Manyatta B', 'Nyalenda A', 'Kolwa Central'],
  'Kisumu West': ['South West Kisumu', 'Central Kisumu', 'Kisumu North', 'West Kisumu', 'North West Kisumu'],
  'Kisumu Central': ['Railways', 'Migosi', 'Shauri Moyo/Kaloleni', 'Market Milimani', 'Kondele', 'Nyalenda B'],
  'Seme': ['West Seme', 'Central Seme', 'East Seme', 'North Seme'],
  'Nyando': ['East Kano/Wawidhi', 'Awasi/Onjiko', 'Ahero', 'Kabonyo/Kanyagwal', 'Kobura'],
  'Muhoroni': ['Miwani', 'Ombeyi', 'Masogo/Nyang\'oma', 'Chemelil', 'Muhoroni/Koru'],
  'Nyakach': ['South West Nyakach', 'North Nyakach', 'Central Nyakach', 'West Nyakach', 'South East Nyakach']
};

const BUILDING_CLASSES = [
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
  { id: 'institution', label: 'Institution', group: 'Other', rate: 6000 },
  { id: 'public-building', label: 'Public Building', group: 'Other', rate: 0 },
  { id: 'government-premises', label: 'Government Premises', group: 'Other', rate: 0 }
];

const OWNER_CATEGORIES = ['Individual', 'Company', 'Trust', 'Sectional Title Owner', 'Property Manager', 'Government Entity'];
const PAYMENT_CHANNELS = ['Mobile Money', 'Bank Transfer', 'Card', 'Cash Office Receipt'];
const FIRST_NAMES = ['Achieng', 'Otieno', 'Auma', 'Owino', 'Adoyo', 'Atieno', 'Onyango', 'Akinyi', 'Wafula', 'Nyongesa', 'Wanjala', 'Mboya'];
const LAST_INITIALS = ['A.', 'B.', 'C.', 'D.', 'E.', 'J.', 'K.', 'M.', 'N.', 'O.', 'P.', 'R.'];
const COMPANY_NAMES = ['Lakeview Holdings', 'Kisumu Mall Traders Ltd', 'Nyanza Properties Ltd', 'Winam Estates', 'Dunga Bay Investments', 'Kondele Commercial Co.', 'Milimani Capital Partners'];

let idCounter = 1;

function genPropertyId() {
  const n = String(idCounter).padStart(5, '0');
  idCounter++;
  return `KSM-P-${n}`;
}

function genReceiptNo() {
  return 'SA-RCT-' + Math.random().toString(36).slice(2, 8).toUpperCase();
}

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildOwnerName(category) {
  if (category === 'Individual' || category === 'Sectional Title Owner') {
    return `${rand(LAST_INITIALS)} ${rand(FIRST_NAMES)}`;
  }
  return rand(COMPANY_NAMES);
}

function mkFlag(type, sev, prop, note) {
  return {
    id: 'AUD-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
    type,
    severity: sev,
    propertyId: prop.id,
    owner: prop.owner,
    subcounty: prop.subcounty,
    ward: prop.ward,
    note,
    createdAt: new Date(Date.now() - randInt(0, 30) * 86400000),
    resolved: false
  };
}

export function seedData() {
  // Clear existing data
  properties = [];
  payments = [];
  auditLog = [];
  tenants = [];

  const subcountyNames = Object.keys(SUBCOUNTIES);
  const subcountyCentres = {
    'Kisumu East': [-0.0850, 34.8100],
    'Kisumu West': [-0.0750, 34.6950],
    'Kisumu Central': [-0.0950, 34.7600],
    'Seme': [-0.0500, 34.6200],
    'Nyando': [-0.1750, 34.9300],
    'Muhoroni': [-0.1450, 35.1900],
    'Nyakach': [-0.3100, 34.9500]
  };

  for (let i = 0; i < 34; i++) {
    const subcounty = rand(subcountyNames);
    const ward = rand(SUBCOUNTIES[subcounty]);
    const cls = rand(BUILDING_CLASSES);
    const ownerCategory = rand(OWNER_CATEGORIES);
    const centre = subcountyCentres[subcounty];
    const lat = centre[0] + (Math.random() - 0.5) * 0.06;
    const lng = centre[1] + (Math.random() - 0.5) * 0.06;

    const unitCount = ['res-apartment', 'maisonette', 'mall', 'serviced-apartment'].includes(cls.id) ? randInt(2, 40) : 1;
    const isExempt = cls.rate === 0;
    const baseRate = isExempt ? 0 : (cls.rate || randInt(2000, 5000));
    const assessedAmount = baseRate * (unitCount > 1 ? Math.ceil(unitCount / 3) : 1);

    const registeredAgo = randInt(10, 600);
    const dueOffset = randInt(-90, 60);
    const isMapped = Math.random() > 0.12;
    const hasTitleLinked = Math.random() > 0.35;

    const compliance = Math.random();
    let status;
    if (isExempt) status = isMapped ? 'compliant' : 'unmapped';
    else if (!isMapped) status = 'unmapped';
    else if (compliance > 0.55) status = 'compliant';
    else if (dueOffset < 0) status = 'overdue';
    else status = 'pending';

    const riskScore = isExempt ? randInt(0, 10) : status === 'overdue' ? randInt(60, 95) : status === 'pending' ? randInt(30, 60) : status === 'unmapped' ? randInt(50, 80) : randInt(5, 30);

    const paidToDate = isExempt ? 0 : (status === 'compliant' ? assessedAmount : (Math.random() > 0.6 ? Math.round(assessedAmount * (Math.random() * 0.6)) : 0));
    const arrears = isExempt ? 0 : Math.max(0, assessedAmount - paidToDate);

    const prop = {
      id: genPropertyId(),
      county: 'Kisumu',
      subcounty,
      ward,
      street: `${ward} Road`,
      buildingName: `${ward.split('/')[0]} ${cls.label} ${randInt(1, 9)}`,
      plotNumber: `KSM/${subcounty.split(' ')[0].slice(0, 3).toUpperCase()}/${randInt(100, 999)}`,
      titleNumber: hasTitleLinked ? `KISUMU/${randInt(1000, 9999)}/${randInt(1, 40)}` : null,
      owner: buildOwnerName(ownerCategory),
      ownerCategory,
      useType: cls.id,
      unitCount,
      occupancyStatus: rand(['Occupied', 'Partially Occupied', 'Vacant']),
      estimatedAnnualValue: assessedAmount * randInt(8, 14),
      assessedAmount,
      arrears,
      paidToDate,
      lat,
      lng,
      isMapped,
      status,
      riskScore,
      registeredAt: new Date(Date.now() - registeredAgo * 86400000),
      dueDate: new Date(Date.now() + dueOffset * 86400000),
      lastInspection: Math.random() > 0.4 ? new Date(Date.now() - randInt(5, 300) * 86400000) : null,
      noticeServed: status === 'overdue' && Math.random() > 0.5,
      paymentPlan: status === 'overdue' && Math.random() > 0.7,
      iprsStatus: 'not_connected',
      ardhiSasaStatus: hasTitleLinked ? 'not_connected' : 'no_title_on_file',
      manualOverride: Math.random() > 0.92
    };
    properties.push(prop);

    if (paidToDate > 0) {
      payments.push({
        receiptNo: genReceiptNo(),
        propertyId: prop.id,
        owner: prop.owner,
        amount: paidToDate,
        date: new Date(Date.now() - randInt(1, 200) * 86400000),
        method: rand(PAYMENT_CHANNELS)
      });
    }
  }

  // Seed audit flags
  properties.forEach(p => {
    if (!p.isMapped) {
      auditLog.push(mkFlag('Missing GIS Pin', 'medium', p, 'Property has no recorded GIS coordinates.'));
    }
    if (p.manualOverride) {
      auditLog.push(mkFlag('Unauthorized Manual Override', 'high', p, 'Assessment was manually overridden outside standard workflow.'));
    }
    if (p.status === 'overdue' && p.arrears > 0) {
      auditLog.push(mkFlag('Unresolved Arrears', 'high', p, `Arrears of KES ${Math.round(p.arrears).toLocaleString()} outstanding past due date.`));
    }
    if (!p.titleNumber) {
      auditLog.push(mkFlag('Missing Title', 'medium', p, 'No title or sectional title deed linked to this property.'));
    }
    if (Math.random() > 0.85) {
      auditLog.push(mkFlag('Suspected Under-Assessment', 'high', p, 'Declared value appears low relative to comparable properties in this ward.'));
    }
    if (Math.random() > 0.9) {
      auditLog.push(mkFlag('Duplicate Owner Record', 'medium', p, 'Owner name closely matches another record in the register.'));
    }
  });

  // Seed tenants
  const rentable = properties.filter(p => !['public-building', 'government-premises', 'school', 'university', 'clinic', 'hospital'].includes(p.useType));
  const sample = rentable.slice(0, 10);
  sample.forEach(p => {
    const tenantCount = randInt(0, 2);
    for (let i = 0; i < tenantCount; i++) {
      const monthlyRent = randInt(8, 40) * 1000;
      const tenant = {
        id: 'TEN-' + Math.random().toString(36).slice(2, 7).toUpperCase(),
        fullName: `${rand(LAST_INITIALS)} ${rand(FIRST_NAMES)}`,
        nationalId: String(randInt(20000000, 39999999)),
        phone: '07' + randInt(10000000, 99999999),
        kraPin: 'A' + randInt(100000000, 999999999) + 'X',
        propertyId: p.id,
        buildingName: p.buildingName,
        unitLabel: `Unit ${randInt(1, Math.max(1, p.unitCount))}`,
        monthlyRent,
        leaseStart: new Date(Date.now() - randInt(30, 500) * 86400000),
        rentStatus: rand(['current', 'arrears']),
        rentArrears: 0
      };
      if (tenant.rentStatus === 'arrears') {
        tenant.rentArrears = tenant.monthlyRent * randInt(1, 3);
      }
      tenants.push(tenant);
    }
  });

  console.log(`Seeded ${properties.length} properties, ${payments.length} payments, ${auditLog.length} audit flags, ${tenants.length} tenants`);
}