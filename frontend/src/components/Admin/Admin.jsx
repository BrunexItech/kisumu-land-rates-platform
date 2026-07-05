import React from 'react';
import { Users, Server, AlertTriangle, Activity, Database, Shield } from 'lucide-react';
import KPICard from '../Dashboard/KPICard';

const Admin = () => {
  const stats = [
    { label: 'Registered Users', value: '8', sub: 'role types configured', color: 'teal' },
    { label: 'System Status', value: 'Operational', sub: 'prototype session', color: 'green' },
    { label: 'Pending Audit Queue', value: '12', sub: 'awaiting review', color: 'gold' },
    { label: 'Verification Logs', value: '0', sub: 'IPRS / Ardhi Sasa attempts', color: 'gray' },
  ];

  const integrations = [
    { name: 'IPRS Identity Verification', status: 'Not Connected' },
    { name: 'Ardhi Sasa Title Intelligence', status: 'Not Connected' },
    { name: 'Google Maps API', status: 'Placeholder' },
    { name: 'County ERP API', status: 'Not Connected' },
    { name: 'Payment Gateway API', status: 'Not Connected' },
    { name: 'SMS / Email Notification API', status: 'Not Connected' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-navy">
            Admin Controls
          </h1>
          <p className="text-ink-faint text-sm">
            Audit queue, reconciliation queue, officer activity, and system health.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, index) => (
          <KPICard key={index} {...stat} />
        ))}
      </div>

      {/* Activity Log */}
      <div className="panel">
        <div className="panel-head">
          <h2>Officer Activity Log</h2>
        </div>
        <div className="panel-body text-sm text-ink-faint">
          Activity logging is illustrative in this prototype — in a live deployment this panel 
          would show per-officer registration, assessment, and resolution actions with timestamps.
        </div>
      </div>

      {/* Integrations */}
      <div className="panel">
        <div className="panel-head">
          <h2>Integration Status — IPRS & Ardhi Sasa</h2>
        </div>
        <div className="panel-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="border-2 border-dashed border-line rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <strong className="text-sm">IPRS Identity Verification</strong>
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
                  <span className="text-gray-400">○</span> Not Connected
                </span>
              </div>
              <div className="text-sm text-ink-faint">
                National ID verification against Kenya's Integrated Population Registration System. 
                Requires lawful basis and a formal data-sharing agreement.
              </div>
            </div>
            <div className="border-2 border-dashed border-line rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <strong className="text-sm">Ardhi Sasa Title Intelligence</strong>
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
                  <span className="text-gray-400">○</span> Not Connected
                </span>
              </div>
              <div className="text-sm text-ink-faint">
                Title and sectional title deed lookup via the Ministry of Lands' platform. 
                Requires live Ardhi Sasa API credentials.
              </div>
            </div>
          </div>

          <div className="text-xs uppercase tracking-wider text-ink-faint font-semibold mb-3">
            End-to-End Workflow (demonstration only)
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {['Identity verified (IPRS)', 'Parcel matched (Ardhi Sasa)', 'Building mapped', 
              'Rates account created', 'Compliance monitored', 'Arrears tracked'].map((step, i) => (
              <React.Fragment key={step}>
                <span className="bg-white border border-line rounded-full px-3 py-1 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-ink-faint text-xs flex items-center justify-center">
                    {i + 1}
                  </span>
                  {step}
                </span>
                {i < 5 && <span className="text-line">→</span>}
              </React.Fragment>
            ))}
          </div>
          <div className="text-xs text-ink-faint mt-3">
            This strip shows the target workflow once both integrations are live. Today, steps 3–6 
            run on real prototype data; steps 1–2 are placeholders pending government authorization.
          </div>
        </div>
      </div>

      {/* API Hooks */}
      <div className="panel">
        <div className="panel-head">
          <h2>API & Integration Hooks</h2>
        </div>
        <div className="panel-body">
          {integrations.map((item) => (
            <div key={item.name} className="flex justify-between items-center py-2 border-b border-line-soft last:border-b-0">
              <span className="text-sm">{item.name}</span>
              <span className={`text-xs font-medium ${
                item.status === 'Not Connected' ? 'text-ink-faint' : 
                item.status === 'Placeholder' ? 'text-amber' : 'text-green'
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;