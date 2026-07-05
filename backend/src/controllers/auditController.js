import { auditLog } from '../data/seedData.js';

export const getAuditFlags = (req, res) => {
  let result = [...auditLog];
  
  const { severity, resolved } = req.query;
  
  if (severity) result = result.filter(f => f.severity === severity);
  if (resolved === 'open') result = result.filter(f => !f.resolved);
  else if (resolved === 'resolved') result = result.filter(f => f.resolved);
  
  res.json(result);
};

export const getAuditStats = (req, res) => {
  const high = auditLog.filter(f => f.severity === 'high' && !f.resolved).length;
  const medium = auditLog.filter(f => f.severity === 'medium' && !f.resolved).length;
  const total = auditLog.filter(f => !f.resolved).length;
  const resolved = auditLog.filter(f => f.resolved).length;
  
  res.json({ high, medium, total, resolved });
};

export const resolveFlag = (req, res) => {
  const flag = auditLog.find(f => f.id === req.params.id);
  if (!flag) {
    return res.status(404).json({ message: 'Flag not found' });
  }
  flag.resolved = true;
  res.json({ message: 'Flag resolved successfully', flag });
};

export const generateBrief = (req, res) => {
  const open = auditLog.filter(f => !f.resolved).length;
  const high = auditLog.filter(f => f.severity === 'high' && !f.resolved).length;
  res.json({ 
    message: `Audit brief generated — ${open} open flags (${high} high severity)`,
    openFlags: open,
    highSeverity: high
  });
};