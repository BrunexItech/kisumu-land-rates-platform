import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../../utils/api';
import { fmtKES } from '../../utils/helpers';
import toast from 'react-hot-toast';

const RegisterForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    owner: '',
    ownerCategory: 'Individual',
    buildingName: '',
    subcounty: '',
    ward: '',
    street: '',
    plotNumber: '',
    titleNumber: '',
    useType: '',
    unitCount: 1,
    occupancyStatus: 'Occupied'
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const subcounties = ['Kisumu East', 'Kisumu West', 'Kisumu Central', 'Seme', 'Nyando', 'Muhoroni', 'Nyakach'];
  const ownerCategories = ['Individual', 'Company', 'Trust', 'Sectional Title Owner', 'Property Manager', 'Government Entity'];
  const occupancyTypes = ['Occupied', 'Partially Occupied', 'Vacant'];
  const buildingTypes = [
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
  ];

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'useType' || field === 'unitCount') {
      updatePreview({ ...formData, [field]: value });
    }
  };

  const updatePreview = (data) => {
    const buildingType = buildingTypes.find(b => b.id === data.useType);
    if (buildingType) {
      const baseRate = buildingType.rate || 3000;
      const units = data.unitCount || 1;
      const amount = baseRate * (units > 1 ? Math.ceil(units / 3) : 1);
      setPreview({
        label: buildingType.label,
        rate: buildingType.rate,
        amount
      });
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.owner || !formData.buildingName || !formData.subcounty || !formData.ward || !formData.useType) {
      toast.error('Please complete all required fields');
      return;
    }

    setLoading(true);
    try {
      await api.post('/properties', formData);
      toast.success('Property registered successfully');
      onSuccess();
    } catch (error) {
      console.error('Error registering property:', error);
      toast.error(error.response?.data?.message || 'Failed to register property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end">
      <div 
        className="absolute inset-0"
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-lg h-full overflow-y-auto shadow-xl animate-slideIn">
        <div className="sticky top-0 bg-white border-b border-line-soft px-4 py-3 flex items-center justify-between z-10">
          <h2 className="font-serif text-lg font-semibold">Register Property</h2>
          <button onClick={onClose} className="p-1 hover:bg-paper rounded-lg">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Owner / Ratepayer name</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. J. Adoyo"
                value={formData.owner}
                onChange={(e) => updateForm('owner', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Owner category</label>
              <select
                className="input"
                value={formData.ownerCategory}
                onChange={(e) => updateForm('ownerCategory', e.target.value)}
              >
                {ownerCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy mb-1">Building name</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Lakeview Apartments"
              value={formData.buildingName}
              onChange={(e) => updateForm('buildingName', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Sub-county</label>
              <select
                className="input"
                value={formData.subcounty}
                onChange={(e) => updateForm('subcounty', e.target.value)}
                required
              >
                <option value="">Select…</option>
                {subcounties.map(sc => <option key={sc} value={sc}>{sc}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Ward</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. Kajulu"
                value={formData.ward}
                onChange={(e) => updateForm('ward', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy mb-1">Street / Plot address</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Milimani Estate, Plot 14"
              value={formData.street}
              onChange={(e) => updateForm('street', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Plot number</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. KSM/MIL/204"
                value={formData.plotNumber}
                onChange={(e) => updateForm('plotNumber', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Title number <span className="font-normal text-ink-faint">(optional)</span></label>
              <input
                type="text"
                className="input"
                placeholder="e.g. KISUMU/4021/7"
                value={formData.titleNumber}
                onChange={(e) => updateForm('titleNumber', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy mb-1">Property / use type</label>
            <select
              className="input"
              value={formData.useType}
              onChange={(e) => updateForm('useType', e.target.value)}
              required
            >
              <option value="">Select a category…</option>
              {['Residential', 'Commercial', 'Hospitality', 'Industrial', 'Institutional', 'Other'].map(group => (
                <optgroup key={group} label={group}>
                  {buildingTypes.filter(b => b.group === group).map(b => (
                    <option key={b.id} value={b.id}>{b.label}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Unit count</label>
              <input
                type="number"
                className="input"
                min="1"
                value={formData.unitCount}
                onChange={(e) => updateForm('unitCount', parseInt(e.target.value) || 1)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Occupancy status</label>
              <select
                className="input"
                value={formData.occupancyStatus}
                onChange={(e) => updateForm('occupancyStatus', e.target.value)}
              >
                {occupancyTypes.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {preview && (
            <div className="bg-navy text-white p-4 rounded-lg">
              <div className="flex justify-between text-sm border-b border-white/15 py-2">
                <span className="text-teal-soft">Category</span>
                <span>{preview.label}</span>
              </div>
              <div className="flex justify-between text-sm border-b border-white/15 py-2">
                <span className="text-teal-soft">Base rate</span>
                <span>{preview.rate ? fmtKES(preview.rate) : 'Exempt / institutional'}</span>
              </div>
              <div className="flex justify-between font-serif font-bold text-lg pt-3">
                <span>Assessed amount</span>
                <span>{fmtKES(preview.amount)}</span>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn btn-primary flex-1 justify-center" disabled={loading}>
              {loading ? 'Registering...' : 'Register & Assess'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;