import { payments, properties } from '../data/seedData.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Get all payments
export const getPayments = (req, res) => {
  res.json(payments);
};

// Get arrears data
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

// Initiate M-Pesa STK Push
export const initiateMpesaPayment = async (req, res) => {
  try {
    const { phoneNumber, amount, propertyId } = req.body;

    console.log('Received payment request:', { phoneNumber, amount, propertyId });

    if (!phoneNumber || !amount || !propertyId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Format phone number correctly
    let cleanPhone = phoneNumber.replace(/\D/g, '');
    
    // Remove leading 254 if present, then add it back
    if (cleanPhone.startsWith('254')) {
      cleanPhone = cleanPhone.substring(3);
    }
    // Remove leading 0 if present
    if (cleanPhone.startsWith('0')) {
      cleanPhone = cleanPhone.substring(1);
    }
    
    const fullPhone = '254' + cleanPhone;

    console.log('Original phone:', phoneNumber);
    console.log('Clean phone:', cleanPhone);
    console.log('Formatted phone:', fullPhone);

    // Get access token
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString('base64');

    console.log('Getting access token...');

    const tokenResponse = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;
    console.log('Access token obtained');

    // Generate password
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

    // STK Push request
    const stkRequest = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: fullPhone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: fullPhone,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: propertyId || 'KISUMU-LAND',
      TransactionDesc: 'Land Rates Payment',
    };

    console.log('STK Request:', JSON.stringify(stkRequest, null, 2));

    const stkResponse = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      stkRequest,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('STK Response:', stkResponse.data);

    res.json({
      success: true,
      message: 'STK Push sent successfully',
      data: stkResponse.data,
    });
  } catch (error) {
    console.error('M-Pesa STK Error Details:');
    console.error('Status:', error.response?.status);
    console.error('Data:', JSON.stringify(error.response?.data, null, 2));
    console.error('Message:', error.message);
    
    // Check for specific error codes
    if (error.response?.data) {
      const errorData = error.response.data;
      if (errorData.errorCode) {
        console.error('M-Pesa Error Code:', errorData.errorCode);
        console.error('M-Pesa Error Message:', errorData.errorMessage);
      }
    }
    
    res.status(500).json({
      message: 'M-Pesa payment initiation failed',
      error: error.response?.data || error.message
    });
  }
};