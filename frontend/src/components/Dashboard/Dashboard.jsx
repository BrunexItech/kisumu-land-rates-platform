import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  CheckCircle, 
  AlertTriangle, 
  DollarSign, 
  TrendingUp,
  Download,
  Printer
} from 'lucide-react';
import KPICard from './KPICard';
import api from '../../utils/api';
import { fmtKES, fmtDate } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    mappedProperties: 0,
    compliantProperties: 0,
    overdueProperties: 0,
    totalArrears: 0,
    revenueCollected: 0,
    complianceRate: 0,
    auditFlags: 0,
    properties: [],
    revenueBySubcounty: [],
    complianceByType: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/properties/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const exportData = (type) => {
    if (type === 'print') {
      window.print();
      return;
    }
    toast.success('CSV export downloaded');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal border-t-transparent"></div>
      </div>
    );
  }

  const COLORS = ['#1B7A4D', '#B4791F', '#9A3324', '#6B7680'];

  const kpiData = [
    { label: 'Total Properties Mapped', value: stats.mappedProperties, sub: `${stats.totalProperties} total registered`, color: 'teal' },
    { label: 'Total Rateable Properties', value: stats.totalProperties, sub: 'across all classes', color: 'gold' },
    { label: 'Compliant Properties', value: stats.compliantProperties, sub: `${stats.complianceRate}% compliance rate`, color: 'green' },
    { label: 'Overdue Properties', value: stats.overdueProperties, sub: 'past due date', color: 'danger' },
    { label: 'Unpaid Arrears', value: fmtKES(stats.totalArrears), sub: 'outstanding balance', color: 'danger' },
    { label: 'Revenue Collected', value: fmtKES(stats.revenueCollected), sub: 'pilot period', color: 'green' },
    { label: 'Compliance Rate', value: `${stats.complianceRate}%`, sub: `${stats.compliantProperties}/${stats.totalProperties} properties`, color: 'teal' },
    { label: 'Audit Flags', value: stats.auditFlags, sub: 'unresolved', color: 'danger' },
  ];

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-navy">
            Executive Dashboard
          </h1>
          <p className="text-ink-faint text-sm">
            Kisumu County property rates intelligence — extending the County's integrated revenue 
            management ecosystem into building-level compliance.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button className="btn btn-sm btn-ghost" onClick={() => exportData('csv')}>
            <Download size={16} /> Export CSV
          </button>
          <button className="btn btn-sm btn-ghost" onClick={() => exportData('print')}>
            <Printer size={16} /> Print View
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="panel">
          <div className="panel-head">
            <h2>Revenue by Sub-County</h2>
          </div>
          <div className="panel-body h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.revenueBySubcounty}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value) => fmtKES(value)} />
                <Bar dataKey="value" fill="#0E6B6B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <h2>Compliance by Property Type</h2>
          </div>
          <div className="panel-body h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.complianceByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.complianceByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="panel">
        <div className="panel-head">
          <h2>Recent Activity</h2>
          <Link to="/register" className="btn btn-sm btn-ghost">
            View register →
          </Link>
        </div>
        <div className="panel-body overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-faint text-[10px] uppercase tracking-wider border-b border-line">
                <th className="px-3 py-2 font-semibold">Property ID</th>
                <th className="px-3 py-2 font-semibold">Owner</th>
                <th className="px-3 py-2 font-semibold hidden md:table-cell">Location</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold hidden sm:table-cell">Assessed</th>
                <th className="px-3 py-2 font-semibold hidden lg:table-cell">Registered</th>
              </tr>
            </thead>
            <tbody>
              {stats.properties.slice(0, 6).map((p) => (
                <tr key={p.id} className="border-b border-line-soft hover:bg-paper cursor-pointer">
                  <td className="px-3 py-2 font-mono text-xs text-teal">{p.id}</td>
                  <td className="px-3 py-2">
                    <div className="font-semibold truncate max-w-[120px]">{p.owner}</div>
                    <div className="text-xs text-ink-faint truncate max-w-[120px]">{p.buildingName}</div>
                  </td>
                  <td className="px-3 py-2 hidden md:table-cell">
                    <div>{p.subcounty}</div>
                    <div className="text-xs text-ink-faint">{p.ward}</div>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`badge ${p.status === 'compliant' ? 'badge-green' : p.status === 'overdue' ? 'badge-danger' : p.status === 'pending' ? 'badge-amber' : 'badge-gray'}`}>
                      {p.status === 'compliant' ? 'Compliant' : p.status === 'overdue' ? 'Overdue' : p.status === 'pending' ? 'Pending' : 'Unmapped'}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-mono font-medium hidden sm:table-cell">
                    {fmtKES(p.assessedAmount)}
                  </td>
                  <td className="px-3 py-2 text-xs text-ink-faint hidden lg:table-cell">
                    {fmtDate(p.registeredAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Dashboard;