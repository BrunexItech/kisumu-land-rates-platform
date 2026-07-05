export const fmtKES = (amount) => {
  return 'KES ' + Math.round(amount).toLocaleString('en-KE');
};

export const fmtDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

export const classOf = (id, buildingClasses) => {
  return buildingClasses.find(c => c.id === id);
};

export const statusBadge = (status) => {
  const map = {
    compliant: { cls: 'badge-green', text: 'Compliant' },
    pending: { cls: 'badge-amber', text: 'Due / Pending' },
    overdue: { cls: 'badge-danger', text: 'Overdue / High Risk' },
    unmapped: { cls: 'badge-gray', text: 'Unregistered / Unmapped' },
  };
  const m = map[status] || map.pending;
  return `<span class="badge ${m.cls}">${m.text}</span>`;
};