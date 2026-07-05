import React from 'react';
import { Info, Shield, AlertTriangle, Database } from 'lucide-react';

const About = () => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-navy">
            About this Platform
          </h1>
          <p className="text-ink-faint text-sm">
            Plain-language summary of what this build is and isn't.
          </p>
        </div>
      </div>

      <div className="panel">
        <div className="panel-body space-y-4 text-sm leading-relaxed">
          <p>
            This is a <strong>prototype</strong> built jointly by <strong>Shelter Afrique</strong> and{' '}
            <strong>Kisumu County</strong> to demonstrate a property-rates intelligence layer extending 
            the County's existing integrated revenue management system for markets, parking, cess, and 
            similar unstructured revenue streams.
          </p>

          <p>
            It is a full-stack application with a React frontend and Node.js/Express backend, with all 
            data held in memory for this session. Nothing is transmitted to any external server, and 
            nothing here is connected to KRA, eTIMS, IPRS, Ardhi Sasa, or any other national system.
          </p>

          <div className="bg-amber-soft border border-amber/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-amber flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-sm">IPRS and Ardhi Sasa</div>
                <div className="text-sm">
                  Panels in each property record are clearly-labeled placeholders showing the intended 
                  future workflow. They do not perform real lookups and do not display real verification 
                  or title data — this is by design, since both are access-restricted government systems 
                  that require formal legal authorization to query.
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 space-y-2">
            <div className="flex items-start gap-3">
              <Database size={20} className="text-teal flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-sm">Data & Seeding</div>
                <div className="text-sm">
                  Seeded data (properties, audit flags, payment history) is randomly generated for 
                  demonstration and resets if the server is restarted. Map locations, ward boundary 
                  circles, and heat zones are illustrative approximations, not surveyed GIS data.
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-green-soft border border-green/30 rounded-lg p-4">
              <div className="font-semibold text-sm flex items-center gap-2">
                <Shield size={18} className="text-green" /> What Works
              </div>
              <ul className="text-sm space-y-1 mt-2 list-disc list-inside">
                <li>Full authentication flow (login/signup)</li>
                <li>Role-based access control</li>
                <li>Property registration & management</li>
                <li>Dashboard with KPI cards & charts</li>
                <li>Interactive map with filters</li>
                <li>Billing & payment tracking</li>
                <li>Audit bot with flag resolution</li>
                <li>Tenant management</li>
                <li>Fully responsive UI</li>
              </ul>
            </div>
            <div className="bg-danger-soft border border-danger/30 rounded-lg p-4">
              <div className="font-semibold text-sm flex items-center gap-2">
                <AlertTriangle size={18} className="text-danger" /> What's Not Connected
              </div>
              <ul className="text-sm space-y-1 mt-2 list-disc list-inside">
                <li>IPRS identity verification</li>
                <li>Ardhi Sasa title lookup</li>
                <li>KRA/eTIMS integration</li>
                <li>Real payment gateways</li>
                <li>SMS/Email notifications</li>
                <li>Google Maps (using OSM)</li>
                <li>County ERP systems</li>
                <li>Document generation</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-line-soft pt-4">
            <div className="font-semibold text-sm">Available Roles</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {['County Administrator', 'Revenue Officer', 'Auditor', 'Field Enumerator', 
                'Supervisor', 'Property Owner', 'Executive Viewer'].map(role => (
                <span key={role} className="bg-paper border border-line rounded-full px-3 py-1 text-xs">
                  {role}
                </span>
              ))}
            </div>
            <div className="text-sm text-ink-faint mt-2">
              Each role sees a different slice of the platform, as a real deployment would enforce.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;