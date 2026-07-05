import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Topbar = ({ toggleSidebar }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    return name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U';
  };

  return (
    <header className="bg-navy text-white sticky top-0 z-50 border-b-3 border-gold">
      <div className="px-3 sm:px-4 md:px-6 h-14 flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={toggleSidebar}
            className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu size={22} />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center font-serif font-bold text-white text-xs md:text-sm flex-shrink-0">
              SA
            </div>
            <div className="hidden xs:block">
              <div className="font-serif font-semibold text-sm md:text-base text-white leading-tight">
                Shelter Afrique
              </div>
              <div className="text-[8px] md:text-[10px] text-teal-soft/70 leading-tight tracking-wider uppercase">
                Land Rates Intelligence
              </div>
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <span className="bg-gold/20 border border-gold/50 text-gold-soft px-2 py-0.5 rounded-full text-[10px] sm:text-xs whitespace-nowrap">
              Kisumu County
            </span>
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-1 sm:gap-2 px-2 py-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gold flex items-center justify-center text-white font-bold text-xs md:text-sm">
                {getInitials(user?.fullName || user?.role)}
              </div>
              <span className="hidden sm:inline text-xs md:text-sm max-w-[120px] truncate">
                {user?.fullName || user?.role}
              </span>
              <ChevronDown size={16} className="hidden sm:block" />
            </button>

            {showUserMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-50 py-1 border border-line">
                  <div className="px-4 py-3 border-b border-line-soft">
                    <div className="text-sm font-semibold text-ink truncate">
                      {user?.fullName || user?.role}
                    </div>
                    <div className="text-xs text-ink-faint truncate">
                      {user?.role || 'User'}
                    </div>
                  </div>
                  
                  <Link 
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-ink hover:bg-paper transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User size={16} />
                    Profile
                  </Link>
                  
                  <Link 
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-ink hover:bg-paper transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings size={16} />
                    Settings
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-danger hover:bg-danger-soft transition-colors border-t border-line-soft"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Kisumu badge */}
          <div className="hidden md:flex items-center gap-2 pl-3 border-l border-white/20">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-green to-green-700 border border-white/35 flex items-center justify-center font-serif font-bold text-white text-[10px] flex-shrink-0">
              KC
            </div>
            <div className="text-[8px] leading-tight text-teal-soft/70">
              Kisumu<br />County
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;