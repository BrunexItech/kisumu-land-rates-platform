import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, FileText } from 'lucide-react';
import api from '../../utils/api';
import { fmtDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const AuditBot = () => {
  const [flags, setFlags] = useState([]);
  const [stats, setStats] = useState({ high: 0, medium: 0, total: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    severity: '',
    resolved: 'open'
  });

  useEffect(() => {
    fetchAuditData();
  }, [filters]);

  const fetchAuditData = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.severity) params.append('severity', filters.severity);
      if (filters.resolved) params.append('resolved', filters.resolved);

      const response = await api.get(`/audit?${params.toString()}`);
      setFlags(response.data);
      
      // Get stats
      const statsRes = await api.get('/audit/stats');
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching audit data:', error);
      toast.error('Failed to load audit data');
    } finally {
      setLoading(false);
    }
  };

  const resolveFlag = async (flagId) => {
    try {
      await api.put(`/audit/${flagId}/resolve`);
      toast.success('Flag marked as resolved');
      fetchAuditData();
    } catch (error) {
      console.error('Error resolving flag:', error);
      toast.error('Failed to resolve flag');
    }
  };

  const generateBrief = async () => {
    try {
      const response = await api.get('/audit/brief');
      toast.success(`Audit brief generated: ${response.data.message}`);
    } catch (error) {
      console.error('Error generating brief:', error);
      toast.error('Failed to generate audit brief');
    }
  };

  const getSeverityBadge = (severity) => {
    const classes = {
      high: 'badge-danger',
      medium: 'badge-amber',
      low: 'badge-gray'
    };
    return <span className={`badge ${classes[severity] || 'badge-gray'}`}>{severity.toUpperCase()}</span>;
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
            Audit Bot Engine
          </h1>
          <p className="text-ink-faint text-sm">
            Continuously scans the register for anomalies — missing records, overdue rates, 
            duplicates, and unmapped buildings — and recommends action.
          </p>
        </div>
        <button className="btn btn-gold" onClick={generateBrief}>
          <FileText size={18} /> Generate Audit Brief
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-paper-raised border border-line rounded-lg p-3">
          <div className="text-xs text-ink-faint uppercase tracking-wider mb-1">High Severity</div>
          <div className="text-xl md:text-2xl font-semibold text-danger">{stats.high}</div>
          <div className="text-xs text-ink-faint">needs urgent review</div>
        </div>
        <div className="bg-paper-raised border border-line rounded-lg p-3">
          <div className="text-xs text-ink-faint uppercase tracking-wider mb-1">Medium Severity</div>
          <div className="text-xl md:text-2xl font-semibold text-amber">{stats.medium}</div>
          <div className="text-xs text-ink-faint">scheduled review</div>
        </div>
        <div className="bg-paper-raised border border-line rounded-lg p-3">
          <div className="text-xs text-ink-faint uppercase tracking-wider mb-1">Total Flags</div>
          <div className="text-xl md:text-2xl font-semibold text-navy">{stats.total}</div>
          <div className="text-xs text-ink-faint">this pilot period</div>
        </div>
        <div className="bg-paper-raised border border-line rounded-lg p-3">
          <div className="text-xs text-ink-faint uppercase tracking-wider mb-1">Resolved Cases</div>
          <div className="text-xl md:text-2xl font-semibold text-green">{stats.resolved}</div>
          <div className="text-xs text-ink-faint">closed by reviewers</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-paper-raised border border-line rounded-lg p-3 sm:p-4">
        <div className="flex flex-wrap gap-3">
          <select
            className="input text-sm max-w-[150px]"
            value={filters.severity}
            onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
          >
            <option value="">All severities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            className="input text-sm max-w-[150px]"
            value={filters.resolved}
            onChange={(e) => setFilters(prev => ({ ...prev, resolved: e.target.value }))}
          >
            <option value="open">Open only</option>
            <option value="">All</option>
            <option value="resolved">Resolved only</option>
          </select>
        </div>
      </div>

      {/* Flag List */}
      <div className="space-y-3">
        {flags.length === 0 ? (
          <div className="bg-paper-raised border border-line rounded-lg p-8 text-center text-ink-faint">
            <div className="text-2xl mb-2">✓</div>
            <div className="font-medium text-ink">No flags match this filter</div>
          </div>
        ) : (
          flags.map((flag) => (
            <div key={flag.id} className="bg-paper-raised border border-line rounded-lg p-4">
              <div className="flex gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  flag.severity === 'high' ? 'bg-danger' : 
                  flag.severity === 'medium' ? 'bg-amber' : 'bg-gray-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="font-semibold text-sm flex items-center gap-2 flex-wrap">
                      {flag.type}
                      {flag.resolved && <span className="badge badge-green text-xs">Resolved</span>}
                      {getSeverityBadge(flag.severity)}
                    </div>
                    <span className="text-xs text-ink-faint whitespace-nowrap">
                      flagged {fmtDate(flag.createdAt)}
                    </span>
                  </div>
                  <div className="text-xs text-ink-faint mt-1">
                    {flag.propertyId} · {flag.owner} · {flag.subcounty}, {flag.ward}
                  </div>
                  <div className="text-sm mt-2">{flag.note}</div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button className="btn btn-sm btn-ghost">Open Property</button>
                    {!flag.resolved && (
                      <>
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => resolveFlag(flag.id)}
                        >
                          <CheckCircle size={14} /> Mark Resolved
                        </button>
                        <button className="btn btn-sm btn-gold">Send Notice</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AuditBot;