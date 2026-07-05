import { payments, properties } from '../data/seedData.js';

export const getPayments = (req, res) => {
  res.json(payments);
};

export const getArrearsData = (req, res) => {
  const buckets = {
    '0-30 days': 0,
    '31-60 days': 0,
    '61-90 days': 0,
    '90+ days': 0
  };
  
  properties.forEach(p => {
    if (p.arrears <= 0) return;
    const daysOverdue = Math.floor((new Date() - new Date(p.dueDate)) / 86400000);
    if (daysOverdue <= 30) buckets['0-30 days'] += p.arrears;
    else if (daysOverdue <= 60) buckets['31-60 days'] += p.arrears;
    else if (daysOverdue <= 90) buckets['61-90 days'] += p.arrears;
    else buckets['90+ days'] += p.arrears;
  });

  const result = Object.entries(buckets).map(([name, value]) => ({ name, value }));
  res.json(result);
};