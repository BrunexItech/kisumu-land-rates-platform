import React, { useState, useEffect } from 'react';
import { Plus, Download, Search } from 'lucide-react';
import RegisterForm from './RegisterForm';
import api from '../../utils/api';
import { fmtKES, fmtDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const PropertyRegister = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    subcounty: '',
    ward: '',
    type: '',
    status: '',
    occupancy: ''
  });

  const subcounties = ['Kisumu East', 'Kisumu West', 'Kisumu Central', 'Seme', 'Nyando', 'Muhoroni', 'Nyakach'];
  const statuses = ['compliant', 'pending', 'overdue', 'unmapped'];
  const occupancyTypes = ['Occupied', 'Partially Occupied', 'Vacant'];
  const buildingTypes = [
    'Residential Apartment', 'Standalone House', 'Maisonette', 'Office Block', 'Shop',
    'Mall', 'Market Stall', 'Hotel', 'Guest House', 'Serviced Apartment',
    'Warehouse', 'Factory', 'Workshop', 'School', 'University',
    'Clinic', 'Hospital', 'Mixed-Use Building', 'Institution', 'Public Building',
    'Government Premises'
  ];

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.subcounty) params.append('subcounty', filters.subcounty);
      if (filters.ward) params.append('ward', filters.ward);
      if (filters.type) params.append('type', filters.type);
      if (filters.status) params.append('status', filters.status);
      if (filters.occupancy) params.append('occupancy', filters.occupancy);

      const response = await api.get(`/properties?${params.toString()}`);
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchProperties();
  };

  const getStatusBadge = (status) => {
    const classes = {
      compliant: 'badge-green',
      pending: 'badge-amber',
      overdue: 'badge-danger',
      unmapped: 'badge-gray'
    };
    const labels = {
      compliant: 'Compliant',
      pending: 'Due / Pending',
      overdue: 'Overdue / High Risk',
      unmapped: 'Unregistered / Unmapped'
    };
    return <span className={`badge ${classes[status] || 'badge-gray'}`}>{labels[status] || status}</span>;
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
            Property & Building Register
          </h1>
          <p className="text-ink-faint text-sm">
            Every rateable property across Kisumu County, searchable by PIN, title number, 
            building name, or owner.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={18} /> Register Property
          </button>
          <button className="btn btn-sm btn-ghost">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-paper-raised border border-line rounded-lg p-3 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" size={16} />
            <input
              type="text"
              className="input pl-9"
              placeholder="Search PIN, title, building, owner…"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>
          <select
            className="input text-sm"
            value={filters.subcounty}
            onChange={(e) => setFilters(prev => ({ ...prev, subcounty: e.target.value, ward: '' }))}
          >
            <option value="">All sub-counties</option>
            {subcounties.map(sc => <option key={sc} value={sc}>{sc}</option>)}
          </select>
          <select
            className="input text-sm"
            value={filters.ward}
            onChange={(e) => setFilters(prev => ({ ...prev, ward: e.target.value }))}
          >
            <option value="">All wards</option>
          </select>
          <select
            className="input text-sm"
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
          >
            <option value="">All property types</option>
            {buildingTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
          <select
            className="input text-sm"
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="">All statuses</option>
            {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <select
            className="input text-sm"
            value={filters.occupancy}
            onChange={(e) => setFilters(prev => ({ ...prev, occupancy: e.target.value }))}
          >
            <option value="">All occupancy</option>
            {occupancyTypes.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-paper-raised border border-line rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-faint text-[10px] uppercase tracking-wider border-b border-line">
                <th className="px-3 py-3 font-semibold">Property ID</th>
                <th className="px-3 py-3 font-semibold">Owner / Building</th>
                <th className="px-3 py-3 font-semibold hidden md:table-cell">Location</th>
                <th className="px-3 py-3 font-semibold hidden lg:table-cell">Type</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3 font-semibold hidden sm:table-cell">Risk</th>
                <th className="px-3 py-3 font-semibold hidden sm:table-cell">Assessed</th>
                <th className="px-3 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {properties.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-3 py-8 text-center text-ink-faint">
                    <div className="text-lg mb-1">⌕</div>
                    <div className="font-medium text-ink">No properties match</div>
                    <div className="text-sm">Try different filters.</div>
                  </td>
                </tr>
              ) : (
                properties.map((p) => (
                  <tr key={p.id} className="border-b border-line-soft hover:bg-paper cursor-pointer">
                    <td className="px-3 py-3 font-mono text-xs text-teal">{p.id}</td>
                    <td className="px-3 py-3">
                      <div className="font-semibold truncate max-w-[120px]">{p.owner}</div>
                      <div className="text-xs text-ink-faint truncate max-w-[120px]">{p.buildingName}</div>
                    </td>
                    <td className="px-3 py-3 hidden md:table-cell">
                      <div>{p.subcounty}</div>
                      <div className="text-xs text-ink-faint">{p.ward}</div>
                    </td>
                    <td className="px-3 py-3 hidden lg:table-cell text-xs">{p.useType}</td>
                    <td className="px-3 py-3">{getStatusBadge(p.status)}</td>
                    <td className="px-3 py-3 hidden sm:table-cell">
                      <span className={`badge ${p.riskScore > 60 ? 'badge-danger' : p.riskScore > 30 ? 'badge-amber' : 'badge-green'}`}>
                        {p.riskScore}
                      </span>
                    </td>
                    <td className="px-3 py-3 font-mono font-medium hidden sm:table-cell">
                      {fmtKES(p.assessedAmount)}
                    </td>
                    <td className="px-3 py-3">
                      <button className="btn btn-sm btn-ghost text-xs">Open →</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Form Modal */}
      {showForm && (
        <RegisterForm onClose={() => setShowForm(false)} onSuccess={handleFormSuccess} />
      )}
    </div>
  );
};

export default PropertyRegister;