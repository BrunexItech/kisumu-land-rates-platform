import React, { useState, useEffect } from 'react';
import { Home, DollarSign, AlertTriangle } from 'lucide-react';
import api from '../../utils/api';
import { fmtKES } from '../../utils/helpers';
import toast from 'react-hot-toast';

const OwnerPortal = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await api.get('/properties/owner');
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching owner properties:', error);
      toast.error('Failed to load your properties');
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
            My Properties
          </h1>
          <p className="text-ink-faint text-sm">
            Your registered properties, balances, and payment options.
          </p>
        </div>
      </div>

      {properties.length === 0 ? (
        <div className="bg-paper-raised border border-line rounded-lg p-8 text-center text-ink-faint">
          <Home size={48} className="mx-auto mb-3 opacity-50" />
          <div className="font-medium text-ink">No properties registered yet</div>
          <div className="text-sm">Contact the County Revenue Office to register your property.</div>
        </div>
      ) : (
        properties.map((p) => (
          <div key={p.id} className="panel">
            <div className="panel-head">
              <h2 className="text-base">{p.buildingName}</h2>
              <span className={`badge ${
                p.status === 'compliant' ? 'badge-green' : 
                p.status === 'overdue' ? 'badge-danger' : 'badge-amber'
              }`}>
                {p.status === 'compliant' ? 'Compliant' : 
                 p.status === 'overdue' ? 'Overdue' : 'Pending'}
              </span>
            </div>
            <div className="panel-body">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex justify-between py-2 border-b border-line-soft text-sm">
                  <span className="text-ink-faint">Property ID</span>
                  <span className="font-mono text-xs">{p.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-line-soft text-sm">
                  <span className="text-ink-faint">Location</span>
                  <span>{p.subcounty}, {p.ward}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-line-soft text-sm">
                  <span className="text-ink-faint">Type</span>
                  <span>{p.useType}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-line-soft text-sm">
                  <span className="text-ink-faint">Assessed</span>
                  <span className="font-mono font-medium">{fmtKES(p.assessedAmount)}</span>
                </div>
                <div className="flex justify-between py-2 text-sm sm:col-span-2">
                  <span className="text-ink-faint">Balance due</span>
                  <span className={`font-mono font-medium ${p.arrears > 0 ? 'text-danger' : 'text-green'}`}>
                    {fmtKES(p.arrears)}
                  </span>
                </div>
              </div>
              {p.arrears > 0 && (
                <button className="btn btn-primary w-full mt-4 justify-center">
                  <DollarSign size={18} /> Pay Now
                </button>
              )}
            </div>
          </div>
        ))
      )}

      <div className="bg-paper-raised border border-line rounded-lg p-4 text-xs text-ink-faint border-dashed">
        Demo note: in this prototype, the Property Owner role shows a sample of properties 
        for illustration. A live deployment would scope this strictly to properties verified 
        as belonging to the signed-in owner.
      </div>
    </div>
  );
};

export default OwnerPortal;