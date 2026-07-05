import React, { useState, useEffect } from 'react';
import { Users, Plus, DollarSign, AlertTriangle } from 'lucide-react';
import api from '../../utils/api';
import { fmtKES, fmtDate } from '../../utils/helpers';
import toast from 'react-hot-toast';
import KPICard from '../Dashboard/KPICard';

const Tenants = () => {
  const [tenants, setTenants] = useState([]);
  const [stats, setStats] = useState({ total: 0, rentRoll: 0, arrearsCount: 0, totalArrears: 0 });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const response = await api.get('/tenants');
      setTenants(response.data);
      
      const statsRes = await api.get('/tenants/stats');
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching tenants:', error);
      toast.error('Failed to load tenants');
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

  const kpiData = [
    { label: 'Total Tenants', value: stats.total, sub: 'across all buildings', color: 'teal' },
    { label: 'Monthly Rent Roll', value: fmtKES(stats.rentRoll), sub: 'expected per month', color: 'green' },
    { label: 'Tenants in Arrears', value: stats.arrearsCount, sub: 'rent overdue', color: 'danger' },
    { label: 'Rent Arrears Outstanding', value: fmtKES(stats.totalArrears), sub: 'total owed', color: 'gold' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-navy">
            Tenants
          </h1>
          <p className="text-ink-faint text-sm">
            Occupiers paying rent across registered buildings, linked to their unit and rent status.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={18} /> Add Tenant
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Tenant List */}
      <div className="panel">
        <div className="panel-head">
          <h2>All Tenants</h2>
        </div>
        <div className="panel-body overflow-x-auto">
          {tenants.length === 0 ? (
            <div className="text-center py-8 text-ink-faint">
              <Users size={48} className="mx-auto mb-3 opacity-50" />
              <div className="font-medium text-ink">No tenants recorded yet</div>
              <div className="text-sm">Add a tenant to link them to a building and rent amount.</div>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink-faint text-[10px] uppercase tracking-wider border-b border-line">
                  <th className="px-3 py-2 font-semibold">Tenant</th>
                  <th className="px-3 py-2 font-semibold hidden sm:table-cell">Building / Unit</th>
                  <th className="px-3 py-2 font-semibold hidden md:table-cell">Phone</th>
                  <th className="px-3 py-2 font-semibold">Monthly Rent</th>
                  <th className="px-3 py-2 font-semibold hidden sm:table-cell">Status</th>
                  <th className="px-3 py-2 font-semibold hidden lg:table-cell">Lease Start</th>
                  <th className="px-3 py-2 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((t) => (
                  <tr key={t.id} className="border-b border-line-soft hover:bg-paper cursor-pointer">
                    <td className="px-3 py-2">
                      <div className="font-semibold truncate max-w-[120px]">{t.fullName}</div>
                      <div className="text-xs text-ink-faint">{t.id}</div>
                    </td>
                    <td className="px-3 py-2 hidden sm:table-cell">
                      <div className="truncate max-w-[120px]">{t.buildingName}</div>
                      <div className="text-xs text-ink-faint">{t.unitLabel}</div>
                    </td>
                    <td className="px-3 py-2 hidden md:table-cell text-xs">{t.phone}</td>
                    <td className="px-3 py-2 font-mono font-medium">{fmtKES(t.monthlyRent)}</td>
                    <td className="px-3 py-2 hidden sm:table-cell">
                      {t.rentStatus === 'current' ? (
                        <span className="badge badge-green">Rent Current</span>
                      ) : (
                        <span className="badge badge-danger">Arrears {fmtKES(t.rentArrears)}</span>
                      )}
                    </td>
                    <td className="px-3 py-2 hidden lg:table-cell text-xs text-ink-faint">
                      {fmtDate(t.leaseStart)}
                    </td>
                    <td className="px-3 py-2">
                      <button className="btn btn-sm btn-ghost text-xs">Open →</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Tenant Modal - Simplified for demo */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="font-serif text-xl mb-4">Add Tenant</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-navy mb-1">Full name</label>
                <input type="text" className="input" placeholder="e.g. Mary Achieng" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy mb-1">National ID</label>
                  <input type="text" className="input" placeholder="e.g. 24681012" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy mb-1">Phone</label>
                  <input type="text" className="input" placeholder="e.g. 0712345678" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy mb-1">Building / Property</label>
                <select className="input">
                  <option value="">Select a property…</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy mb-1">Unit</label>
                  <input type="text" className="input" placeholder="e.g. Unit 3B" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy mb-1">Monthly rent (KES)</label>
                  <input type="number" className="input" placeholder="e.g. 18000" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button className="btn btn-primary flex-1 justify-center">Add Tenant</button>
                <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tenants;