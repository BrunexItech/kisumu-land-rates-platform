import React from 'react';

const KPICard = ({ label, value, sub, color = 'teal' }) => {
  const colorMap = {
    teal: 'bg-teal',
    gold: 'bg-gold',
    green: 'bg-green',
    danger: 'bg-danger',
    gray: 'bg-gray-500'
  };

  return (
    <div className="bg-paper-raised border border-line rounded-lg p-3 md:p-4 relative">
      <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r ${colorMap[color] || 'bg-teal'}`} />
      <div className="text-[10px] text-ink-faint uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className="font-serif text-lg md:text-xl lg:text-2xl font-semibold text-navy">
        {value}
      </div>
      <div className="text-xs text-ink-faint mt-1">{sub}</div>
    </div>
  );
};

export default KPICard;