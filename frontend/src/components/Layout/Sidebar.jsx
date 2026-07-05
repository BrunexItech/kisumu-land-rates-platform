import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  ClipboardList, 
  CreditCard, 
  AlertTriangle, 
  Settings,
  Home,
  Users,
  Info,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, role }) => {
  const getNavItems = () => {
    const items = {
      'County Administrator': [
        { to: '/', icon: LayoutDashboard, label: 'Executive Dashboard' },
        { to: '/map', icon: MapPin, label: 'Live Map' },
        { to: '/register', icon: ClipboardList, label: 'Property Register' },
        { to: '/billing', icon: CreditCard, label: 'Billing & Payments' },
        { to: '/audit', icon: AlertTriangle, label: 'Audit Bot' },
        { to: '/admin', icon: Settings, label: 'Admin Controls' },
        { to: '/tenants', icon: Users, label: 'Tenants' },
        { to: '/about', icon: Info, label: 'About' },
      ],
      'Revenue Officer': [
        { to: '/', icon: LayoutDashboard, label: 'Executive Dashboard' },
        { to: '/map', icon: MapPin, label: 'Live Map' },
        { to: '/register', icon: ClipboardList, label: 'Property Register' },
        { to: '/billing', icon: CreditCard, label: 'Billing & Payments' },
        { to: '/about', icon: Info, label: 'About' },
      ],
      'Auditor': [
        { to: '/', icon: LayoutDashboard, label: 'Executive Dashboard' },
        { to: '/map', icon: MapPin, label: 'Live Map' },
        { to: '/audit', icon: AlertTriangle, label: 'Audit Bot' },
        { to: '/about', icon: Info, label: 'About' },
      ],
      'Field Enumerator': [
        { to: '/map', icon: MapPin, label: 'Live Map' },
        { to: '/register', icon: ClipboardList, label: 'Property Register' },
        { to: '/about', icon: Info, label: 'About' },
      ],
      'Supervisor': [
        { to: '/', icon: LayoutDashboard, label: 'Executive Dashboard' },
        { to: '/map', icon: MapPin, label: 'Live Map' },
        { to: '/register', icon: ClipboardList, label: 'Property Register' },
        { to: '/billing', icon: CreditCard, label: 'Billing & Payments' },
        { to: '/audit', icon: AlertTriangle, label: 'Audit Bot' },
        { to: '/tenants', icon: Users, label: 'Tenants' },
        { to: '/about', icon: Info, label: 'About' },
      ],
      'Property Owner': [
        { to: '/owner-portal', icon: Home, label: 'My Properties' },
        { to: '/tenants', icon: Users, label: 'Tenants' },
        { to: '/about', icon: Info, label: 'About' },
      ],
      'Tenant': [
        { to: '/tenants', icon: Users, label: 'My Tenancy' },
        { to: '/about', icon: Info, label: 'About' },
      ],
      'Executive Viewer': [
        { to: '/', icon: LayoutDashboard, label: 'Executive Dashboard' },
        { to: '/about', icon: Info, label: 'About' },
      ],
    };

    return items[role] || items['County Administrator'];
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`
        lg:hidden fixed inset-y-0 left-0 w-64 bg-white border-r border-line z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-4 border-b border-line-soft">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center font-serif font-bold text-white text-xs">
              SA
            </div>
            <span className="font-serif font-semibold text-sm text-navy">Shelter Afrique</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-paper rounded-lg">
            <X size={20} />
          </button>
        </div>
        <SidebarContent items={navItems} onClose={onClose} />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-56 bg-white border-r border-line h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto">
        <SidebarContent items={navItems} />
      </div>
    </>
  );
};

const SidebarContent = ({ items, onClose }) => {
  const groupItems = () => {
    const groups = {};
    items.forEach(item => {
      const section = item.label.includes('Dashboard') || item.label.includes('Map') ? 'Overview' :
                     item.label.includes('Register') || item.label.includes('Properties') ? 'Register' :
                     item.label.includes('Billing') || item.label.includes('Payments') ? 'Collection' :
                     item.label.includes('Audit') || item.label.includes('Admin') ? 'Compliance' :
                     item.label.includes('Tenants') || item.label.includes('Tenancy') ? 'Occupiers' :
                     item.label.includes('My') ? 'Owner' : 'Pilot';
      if (!groups[section]) groups[section] = [];
      groups[section].push(item);
    });
    return groups;
  };

  const grouped = groupItems();

  return (
    <nav className="py-3">
      {Object.entries(grouped).map(([section, items]) => (
        <div key={section}>
          <div className="px-4 py-2 text-[10px] uppercase tracking-wider text-ink-faint font-semibold">
            {section}
          </div>
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-2.5 text-sm text-ink transition-colors
                ${isActive ? 'bg-teal-soft border-l-3 border-teal font-semibold' : 'hover:bg-paper border-l-3 border-transparent'}
              `}
              onClick={onClose}
            >
              <item.icon size={18} className="opacity-70 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  );
};

export default Sidebar;