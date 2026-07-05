import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('County Administrator');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const roles = [
    'County Administrator',
    'Revenue Officer',
    'Auditor',
    'Field Enumerator',
    'Supervisor',
    'Property Owner',
    'Tenant',
    'Executive Viewer'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Please enter username and password');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, user } = response.data;
      login(token, user);
      toast.success(`Welcome back, ${user.fullName || user.role}!`);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-deep p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6 md:p-8 shadow-2xl">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center font-serif font-bold text-white text-sm flex-shrink-0">
            SA
          </div>
          <span className="font-serif font-semibold text-lg text-navy">Shelter Afrique</span>
        </div>
        <p className="text-xs text-ink-faint ml-13 mb-6">
          Kisumu County Digital Land Rates Intelligence Platform
        </p>

        <h2 className="font-serif text-xl mb-6">Sign in</h2>

        <form onSubmit={handleSubmit}>
          {/* Role selection */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-navy mb-2">Role</label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {roles.map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`
                    text-left p-2 rounded border text-xs transition-colors
                    ${role === r 
                      ? 'border-teal bg-teal-soft' 
                      : 'border-line hover:bg-paper'}
                  `}
                  onClick={() => setRole(r)}
                >
                  <div className="font-semibold text-xs">{r}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Username */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-navy mb-1">Username</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. a.otieno"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-navy mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="input pr-10"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full justify-center"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-4 p-3 bg-slate-50 rounded text-xs text-ink-faint leading-relaxed">
          Prototype sign-in — any username/password works. The role you select 
          determines what you can see and do.
        </div>

        <div className="text-center mt-4 text-sm">
          New here?{' '}
          <Link to="/signup" className="text-teal hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;