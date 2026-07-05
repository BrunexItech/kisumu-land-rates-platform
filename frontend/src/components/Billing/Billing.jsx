import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../utils/api';
import { fmtKES, fmtDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const Billing = () => {
  const [payments, setPayments] = useState([]);
  const [arrearsData, setArrearsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [paymentsRes, arrearsRes] = await Promise.all([
        api.get('/payments'),
        api.get('/payments/arrears')
      ]);
      setPayments(paymentsRes.data);
      setArrearsData(arrearsRes.data);
    } catch (error) {
      console.error('Error fetching billing data:', error);
      toast.error('Failed to load billing data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-navy">
            Billing & Payment Tracker
          </h1>
          <p className="text-ink-faint text-sm">
            Property rates, penalties, and payment history across all channels.
          </p>
        </div>
      </div>

      {/* Arrears Aging Chart */}
      <div className="panel">
        <div className="panel-head">
          <h2>Arrears Aging</h2>
        </div>
        <div className="panel-body h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={arrearsData}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(value) => fmtKES(value)} />
              <Bar 
                dataKey="value" 
                fill="#0E6B6B"
                shape={(props) => {
                  const { x, y, width, height, payload } = props;
                  const colors = {
                    '0-30 days': '#0E6B6B',
                    '31-60 days': '#0E6B6B',
                    '61-90 days': '#B4791F',
                    '90+ days': '#9A3324'
                  };
                  return (
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill={colors[payload.name] || '#0E6B6B'}
                      rx={2}
                    />
                  );
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payment History */}
      <div className="panel">
        <div className="panel-head">
          <h2>Payment History</h2>
        </div>
        <div className="panel-body overflow-x-auto">
          {payments.length === 0 ? (
            <div className="text-center py-8 text-ink-faint">
              <div className="text-lg mb-1">$</div>
              <div className="font-medium text-ink">No payments recorded yet</div>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink-faint text-[10px] uppercase tracking-wider border-b border-line">
                  <th className="px-3 py-2 font-semibold">Receipt</th>
                  <th className="px-3 py-2 font-semibold">Property</th>
                  <th className="px-3 py-2 font-semibold hidden sm:table-cell">Owner</th>
                  <th className="px-3 py-2 font-semibold">Amount</th>
                  <th className="px-3 py-2 font-semibold hidden md:table-cell">Method</th>
                  <th className="px-3 py-2 font-semibold hidden lg:table-cell">Date</th>
                  <th className="px-3 py-2 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.receiptNo} className="border-b border-line-soft hover:bg-paper">
                    <td className="px-3 py-2 font-mono text-xs text-teal">{p.receiptNo}</td>
                    <td className="px-3 py-2 font-mono text-xs">{p.propertyId}</td>
                    <td className="px-3 py-2 hidden sm:table-cell">{p.owner}</td>
                    <td className="px-3 py-2 font-mono font-medium">{fmtKES(p.amount)}</td>
                    <td className="px-3 py-2 hidden md:table-cell text-xs">{p.method}</td>
                    <td className="px-3 py-2 hidden lg:table-cell text-xs text-ink-faint">
                      {fmtDate(p.date)}
                    </td>
                    <td className="px-3 py-2">
                      <button className="btn btn-sm btn-ghost text-xs">View →</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Billing;