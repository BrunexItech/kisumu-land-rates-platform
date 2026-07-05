import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const Signup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    role: 'Tenant',
    nationalId: '',
    kraPin: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
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

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.fullName.trim()) {
        toast.error('Please enter your full name');
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (!formData.nationalId.trim() || !formData.kraPin.trim()) {
        toast.error('Please enter National ID and KRA PIN');
        return false;
      }
      return true;
    }
    if (step === 3) {
      if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 9) {
        toast.error('Please enter a valid phone number');
        return false;
      }
      return true;
    }
    if (step === 4) {
      // Trim both values and compare as strings
      const enteredOtp = otpCode.trim();
      const expectedOtp = generatedOtp.trim();
      
      if (enteredOtp !== expectedOtp) {
        toast.error('Invalid verification code. Please enter the code shown above.');
        return false;
      }
      return true;
    }
    if (step === 5) {
      if (!formData.username.trim()) {
        toast.error('Please choose a username');
        return false;
      }
      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return false;
      }
      return true;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const sendOtp = () => {
    if (validateStep()) {
      const code = String(Math.floor(100000 + Math.random() * 900000));
      setGeneratedOtp(code);
      setOtpCode(''); // Clear the input field
      toast.success(`Simulated OTP: ${code}`);
      setStep(4);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setLoading(true);
    try {
      const { confirmPassword, ...userData } = formData;
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      login(token, user);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.response?.data?.message || 'Account creation failed');
    } finally {
      setLoading(false);
    }
  };

  const getStepTitle = () => {
    const titles = [
      'Create your account — Step 1 of 5',
      'Create your account — Step 2 of 5',
      'Create your account — Step 3 of 5',
      'Create your account — Step 4 of 5',
      'Create your account — Step 5 of 5'
    ];
    return titles[step - 1] || titles[0];
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-navy mb-1">Full name</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. James Otieno Adoyo"
                value={formData.fullName}
                onChange={(e) => updateForm('fullName', e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-navy mb-1">Role</label>
              <select
                className="input"
                value={formData.role}
                onChange={(e) => updateForm('role', e.target.value)}
              >
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </>
        );

      case 2:
        return (
          <>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-navy mb-1">National ID number</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. 24681012"
                value={formData.nationalId}
                onChange={(e) => updateForm('nationalId', e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-navy mb-1">KRA PIN</label>
              <input
                type="text"
                className="input uppercase"
                placeholder="e.g. A012345678X"
                value={formData.kraPin}
                onChange={(e) => updateForm('kraPin', e.target.value)}
              />
              <p className="text-xs text-ink-faint mt-1">
                Stored locally for this prototype only — not validated against KRA's live system.
              </p>
            </div>
          </>
        );

      case 3:
        return (
          <>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-navy mb-1">Phone number</label>
              <input
                type="tel"
                className="input"
                placeholder="e.g. 0712345678"
                value={formData.phone}
                onChange={(e) => updateForm('phone', e.target.value)}
              />
              <p className="text-xs text-ink-faint mt-1">
                We'll send a one-time verification code to this number.
              </p>
            </div>
          </>
        );

      case 4:
        return (
          <>
            <div className="bg-teal-soft p-4 rounded-lg mb-4 text-center">
              <div className="text-xs text-ink-faint mb-1">Your simulated one-time code</div>
              <div className="font-mono text-3xl font-bold tracking-widest text-navy">
                {generatedOtp}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-navy mb-1">
                Enter the code above to verify
              </label>
              <input
                type="text"
                className="input"
                placeholder="6-digit code"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            <div className="text-xs text-ink-faint bg-gray-50 p-3 rounded mb-4">
              Prototype notice: no real SMS gateway is connected. The code is generated 
              locally and shown on screen.
            </div>
          </>
        );

      case 5:
        return (
          <>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-navy mb-1">Choose a username</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. j.adoyo"
                value={formData.username}
                onChange={(e) => updateForm('username', e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-navy mb-1">Choose a password</label>
              <input
                type="password"
                className="input"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={(e) => updateForm('password', e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-navy mb-1">Confirm password</label>
              <input
                type="password"
                className="input"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={(e) => updateForm('confirmPassword', e.target.value)}
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const renderActions = () => {
    if (step === 1) {
      return (
        <button className="btn btn-primary w-full justify-center" onClick={handleNext}>
          Continue
        </button>
      );
    }
    if (step === 2) {
      return (
        <div className="flex gap-3">
          <button className="btn btn-ghost" onClick={handleBack}>← Back</button>
          <button className="btn btn-primary flex-1 justify-center" onClick={handleNext}>Continue</button>
        </div>
      );
    }
    if (step === 3) {
      return (
        <div className="flex gap-3">
          <button className="btn btn-ghost" onClick={handleBack}>← Back</button>
          <button className="btn btn-primary flex-1 justify-center" onClick={sendOtp}>
            Send Verification Code
          </button>
        </div>
      );
    }
    if (step === 4) {
      return (
        <div className="flex gap-3">
          <button className="btn btn-ghost" onClick={handleBack}>← Back</button>
          <button className="btn btn-primary flex-1 justify-center" onClick={handleNext}>
            Verify & Continue
          </button>
        </div>
      );
    }
    if (step === 5) {
      return (
        <div className="flex gap-3">
          <button className="btn btn-ghost" onClick={handleBack}>← Back</button>
          <button 
            className="btn btn-primary flex-1 justify-center" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-deep p-4">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 md:p-8 shadow-2xl">
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

        <h2 className="font-serif text-xl mb-4">{getStepTitle()}</h2>

        {/* Progress bar */}
        <div className="flex gap-1 mb-6">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className="h-1 flex-1 rounded-full transition-colors"
              style={{
                background: s <= step ? '#0E6B6B' : '#D8D2C4'
              }}
            />
          ))}
        </div>

        {renderStep()}
        {renderActions()}

        <div className="mt-4 text-xs text-ink-faint bg-gray-50 p-3 rounded">
          This is a one-time registration across 5 steps — your details are captured once here, 
          then you sign in normally afterward using the username and password from step 5.
        </div>

        <div className="text-center mt-4 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-teal hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;