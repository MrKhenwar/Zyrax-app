import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../services/store';
import { registerUser, verifyOTP } from '../services/api';

export default function RegisterModal() {
  const { modals, toggleModal, setAuthenticated, setUserProfile } = useAppStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [normalizedPhone, setNormalizedPhone] = useState('');

  const normalizePhoneNumber = (phone) => {
    let normalized = phone;
    if (!normalized.startsWith('+91') && !normalized.startsWith('91')) {
      normalized = '+91' + normalized.replace(/^\+/, '');
    }
    return normalized;
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const normalPhone = normalizePhoneNumber(formData.phoneNumber);
      setNormalizedPhone(normalPhone);

      const registrationData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: normalPhone,
        date_of_birth: formData.dateOfBirth,
        password: formData.password,
        confirm_password: formData.confirmPassword
      };

      await registerUser(registrationData);
      setOtpSent(true);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await verifyOTP(normalizedPhone, otp);

      if (response.message || response.success) {
        // Registration successful, redirect to login
        toggleModal('register', false);
        toggleModal('login', true);
        resetForm();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      phoneNumber: '',
      dateOfBirth: '',
      password: '',
      confirmPassword: ''
    });
    setOtp('');
    setOtpSent(false);
    setError('');
  };

  const closeModal = () => {
    toggleModal('register', false);
    resetForm();
  };

  return (
    <AnimatePresence>
      {modals.register && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-8 border border-purple-500/20 max-h-[90vh] overflow-y-auto">
              {/* Decorative gradients */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl" />

              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="relative z-10">
                {!otpSent ? (
                  <>
                    {/* Header */}
                    <div className="mb-6 text-center">
                      <div className="inline-block mb-2 px-4 py-2 bg-pink-500/10 rounded-full border border-pink-500/30">
                        <span className="text-pink-300 text-sm font-medium">JOIN US</span>
                      </div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
                        Create Account
                      </h2>
                      <p className="text-gray-400 text-sm mt-2">Start your fitness journey today</p>
                    </div>

                    {/* Error message */}
                    {error && (
                      <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4">
                        {error}
                      </div>
                    )}

                    {/* Registration Form */}
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2">First Name</label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-white placeholder-gray-500"
                            placeholder="First name"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2">Last Name</label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-white placeholder-gray-500"
                            placeholder="Last name"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Phone Number</label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-white placeholder-gray-500"
                          placeholder="Enter your phone number"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Date of Birth</label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-white placeholder-gray-500"
                          placeholder="Create a password"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Confirm Password</label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-white placeholder-gray-500"
                          placeholder="Confirm your password"
                        />
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={showPassword}
                          onChange={() => setShowPassword(!showPassword)}
                          className="rounded border-gray-600 text-pink-500 focus:ring-pink-500"
                        />
                        <span className="ml-2 text-sm text-gray-400">Show Password</span>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50"
                      >
                        {loading ? 'Creating account...' : 'Create Account'}
                      </button>
                    </form>

                    {/* Login link */}
                    <div className="mt-6 text-center">
                      <p className="text-gray-400">
                        Already have an account?{' '}
                        <button
                          onClick={() => {
                            toggleModal('register', false);
                            toggleModal('login', true);
                          }}
                          className="text-pink-500 hover:text-pink-400 font-semibold"
                        >
                          Sign in
                        </button>
                      </p>
                    </div>
                  </>
                ) : (
                  /* OTP Verification */
                  <>
                    <div className="mb-6 text-center">
                      <h2 className="text-3xl font-bold text-white mb-2">Verify Your Number</h2>
                      <p className="text-gray-400">Enter the 6-digit code sent to {normalizedPhone}</p>
                    </div>

                    {error && (
                      <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4">
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleVerifyOTP} className="space-y-4">
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Enter OTP</label>
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          maxLength={6}
                          required
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-white text-center text-2xl tracking-widest"
                          placeholder="000000"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading || otp.length !== 6}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50"
                      >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
