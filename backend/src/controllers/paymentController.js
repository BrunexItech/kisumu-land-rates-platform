import { payments, properties } from '../data/seedData.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

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

export const initiateMpesaPayment = async (req, res) => {
  try {
    const { phoneNumber, amount, propertyId } = req.body;

    console.log('Payment request:', { phoneNumber, amount, propertyId });

    if (!phoneNumber || !amount || !propertyId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Format phone number
    let cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.startsWith('254')) cleanPhone = cleanPhone.substring(3);
    if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);
    const fullPhone = '254' + cleanPhone;
    console.log('Formatted phone:', fullPhone);

    // Get access token
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString('base64');

    const tokenRes = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      { headers: { Authorization: `Basic ${auth}` } }
    );
    console.log('Token obtained');

    // Generate timestamp ONCE and reuse it
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    console.log('Timestamp:', timestamp);
    
    // Generate password using the SAME timestamp - HARDCODED to match curl
    const password = Buffer.from(
      `174379bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919${timestamp}`
    ).toString('base64');
    console.log('Password generated');

    // STK Push - EXACT MATCH to working curl
    const stkRequest = {
      BusinessShortCode: '174379',
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: fullPhone,
      PartyB: '174379',
      PhoneNumber: fullPhone,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: propertyId,
      TransactionDesc: 'Land Rates Payment'
    };

    console.log('Sending STK Push...');

    const stkRes = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      stkRequest,
      { 
        headers: { 
          Authorization: `Bearer ${tokenRes.data.access_token}`, 
          'Content-Type': 'application/json' 
        } 
      }
    );

    console.log('STK Response:', stkRes.data);

    res.json({ 
      success: true, 
      message: 'STK Push sent successfully',
      data: stkRes.data 
    });
  } catch (error) {
    console.error('M-Pesa Error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'M-Pesa payment initiation failed',
      error: error.response?.data || error.message 
    });
  }
};