import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../services/store';
import { loginUser, loginWithOTP, verifyLoginOTP } from '../services/api';
import { v4 as uuidv4 } from 'uuid';

export default function LoginModal() {
  const { modals, toggleModal, setAuthenticated, setUserProfile } = useAppStore();
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [deviceLimitError, setDeviceLimitError] = useState(false);
  const [deviceList, setDeviceList] = useState([]);

  // OTP countdown timer
  useEffect(() => {
    if (otpTimer > 0) {
      const countdown = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [otpTimer]);

  // Get device information
  const getDeviceInfo = () => {
    const browser = navigator.userAgent.includes('Chrome') ? 'Chrome' :
                    navigator.userAgent.includes('Firefox') ? 'Firefox' :
                    navigator.userAgent.includes('Safari') ? 'Safari' : 'Unknown';
    const os = navigator.userAgent.includes('Windows') ? 'Windows' :
               navigator.userAgent.includes('Mac') ? 'MacOS' :
               navigator.userAgent.includes('Android') ? 'Android' :
               navigator.userAgent.includes('iPhone') ? 'iOS' : 'Unknown';

    let clientId = localStorage.getItem('deviceClientId');
    if (!clientId) {
      clientId = uuidv4();
      localStorage.setItem('deviceClientId', clientId);
    }

    return {
      clientId,
      browser,
      os,
      screen: `${window.screen.width}x${window.screen.height}`,
      device_type: /Mobile|Tablet/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
      device_name: `${os} ${browser}`
    };
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const deviceInfo = getDeviceInfo();
      const response = await loginUser(phoneNumber.trim(), password, deviceInfo);

      if (response.access && response.refresh) {
        localStorage.setItem('accessToken', response.access);
        localStorage.setItem('refreshToken', response.refresh);
        setAuthenticated(true);
        if (response.user) setUserProfile(response.user);
        toggleModal('login', false);
        resetForm();
        window.location.reload();
      } else {
        setError('Invalid phone number or password');
      }
    } catch (err) {
      console.error('Login error:', err);

      // Check if it's a device limit error (403 with specific message)
      if (err.response?.status === 403) {
        const errorData = err.response?.data;
        if (errorData?.code === 'DEVICE_LIMIT_REACHED' ||
            errorData?.error?.includes('device') ||
            errorData?.error?.includes('2 devices')) {
          setDeviceLimitError(true);
          setDeviceList(errorData?.devices || []);
          setError('');
        } else {
          setError(errorData?.error || 'Access forbidden. Please check your credentials.');
        }
      } else {
        setError(err.response?.data?.error || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginWithOTP(phoneNumber.trim());
      setOtpSent(true);
      setOtpTimer(60);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const deviceInfo = getDeviceInfo();
      const response = await verifyLoginOTP(phoneNumber.trim(), otp, deviceInfo);

      if (response.access && response.refresh) {
        localStorage.setItem('accessToken', response.access);
        localStorage.setItem('refreshToken', response.refresh);
        setAuthenticated(true);
        if (response.user) setUserProfile(response.user);
        toggleModal('login', false);
        resetForm();
        window.location.reload();
      }
    } catch (err) {
      // Check if it's a device limit error (403)
      if (err.response?.status === 403) {
        const errorData = err.response?.data;
        if (errorData?.code === 'DEVICE_LIMIT_REACHED') {
          setDeviceLimitError(true);
          setDeviceList(errorData?.devices || []);
          setError('');
        } else {
          setError(errorData?.error || 'Access forbidden.');
        }
      } else {
        setError(err.response?.data?.error || 'Invalid OTP');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForceLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const deviceInfo = getDeviceInfo();
      const payload = {
        device_info: deviceInfo
      };

      if (loginMethod === 'otp') {
        payload.phone_number = phoneNumber.trim();
        payload.otp = otp;
      } else {
        payload.username = phoneNumber.trim();
        payload.password = password;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/devices/force-login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.access && data.refresh) {
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        setAuthenticated(true);
        if (data.user) setUserProfile(data.user);
        toggleModal('login', false);
        resetForm();
        window.location.reload();
      } else {
        setError(data.message || data.error || 'Force login failed');
      }
    } catch (err) {
      setError('Failed to force login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPhoneNumber('');
    setPassword('');
    setOtp('');
    setOtpSent(false);
    setError('');
    setLoginMethod('password');
    setDeviceLimitError(false);
    setDeviceList([]);
  };

  const closeModal = () => {
    toggleModal('login', false);
    resetForm();
  };

  return (
    <AnimatePresence>
      {modals.login && (
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
            <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-8 border border-purple-500/20">
              {/* Decorative gradients */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl" />

              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Header */}
              {!deviceLimitError && (
                <div className="relative z-10 mb-6 text-center">
                  <div className="inline-block mb-2 px-4 py-2 bg-purple-500/10 rounded-full border border-purple-500/30">
                    <span className="text-purple-300 text-sm font-medium">WELCOME BACK</span>
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
                    Sign In to Zyrax
                  </h2>
                  <p className="text-gray-400 text-sm mt-2">Enter your credentials to continue</p>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4 relative z-10">
                  {error}
                </div>
              )}

              <div className="relative z-10">
                {deviceLimitError ? (
                  /* Device Limit Error Screen */
                  <div>
                    <div className="mb-6 text-center">
                      <div className="inline-block mb-2 px-4 py-2 bg-red-500/10 rounded-full border border-red-500/30">
                        <span className="text-red-300 text-sm font-medium">DEVICE LIMIT</span>
                      </div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-2">
                        Device Limit Reached
                      </h2>
                      <p className="text-gray-400 text-sm">You can only use 2 devices at a time</p>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
                      <p className="text-yellow-300 text-sm">
                        Click "Force Login" below to automatically logout from the oldest device and login here.
                      </p>
                    </div>

                    {/* Show device list if available */}
                    {deviceList.length > 0 && (
                      <div className="bg-gray-700/30 rounded-lg p-4 mb-4">
                        <p className="text-gray-300 text-sm font-semibold mb-3">Your active devices:</p>
                        <div className="space-y-2">
                          {deviceList.map((device, index) => (
                            <div key={device.id || index} className="flex justify-between items-center text-xs bg-gray-800/50 p-2 rounded">
                              <div>
                                <div className="text-white font-medium">{device.device_name || 'Unknown Device'}</div>
                                <div className="text-gray-400">{device.browser} • {device.os}</div>
                                <div className="text-gray-500">
                                  Last active: {device.last_login ? new Date(device.last_login).toLocaleDateString() : 'Unknown'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <button
                        onClick={handleForceLogin}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all disabled:opacity-50"
                      >
                        {loading ? 'Processing...' : '🚀 Force Login (Remove Oldest Device)'}
                      </button>

                      <button
                        onClick={() => setDeviceLimitError(false)}
                        className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold transition-all"
                      >
                        ← Back to Login
                      </button>
                    </div>
                  </div>
                ) : loginMethod === 'password' ? (
                  /* Password Login Form */
                  <form onSubmit={handlePasswordLogin}>
                    <div className="mb-4">
                      <label className="block text-gray-300 text-sm font-medium mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white placeholder-gray-500"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white placeholder-gray-500"
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 mb-4"
                    >
                      {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setLoginMethod('otp')}
                        className="text-purple-300 text-sm hover:text-purple-400 underline"
                      >
                        Sign in using OTP
                      </button>
                    </div>
                  </form>
                ) : (
                  /* OTP Login Form */
                  <form onSubmit={otpSent ? handleVerifyOTP : handleRequestOTP}>
                    <div className="mb-4">
                      <label className="block text-gray-300 text-sm font-medium mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        disabled={otpSent}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white placeholder-gray-500 disabled:opacity-50"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    {otpSent && (
                      <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-medium mb-2">Enter OTP</label>
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          maxLength={6}
                          required
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white placeholder-gray-500"
                          placeholder="Enter 6-digit OTP"
                        />
                        {otpTimer > 0 ? (
                          <p className="text-sm text-gray-400 mt-2">Resend OTP in {otpTimer}s</p>
                        ) : (
                          <button
                            type="button"
                            onClick={handleRequestOTP}
                            className="text-sm text-purple-300 hover:text-purple-400 underline mt-2"
                          >
                            Resend OTP
                          </button>
                        )}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 mb-4"
                    >
                      {loading ? 'Please wait...' : otpSent ? 'Verify & Login' : 'Send OTP'}
                    </button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setLoginMethod('password');
                          setOtpSent(false);
                          setOtp('');
                        }}
                        className="text-purple-300 text-sm hover:text-purple-400 underline"
                      >
                        Use Password Instead
                      </button>
                    </div>
                  </form>
                )}

                {/* Register link */}
                {!deviceLimitError && (
                  <div className="mt-6 text-center">
                    <p className="text-gray-400">
                      Don't have an account?{' '}
                      <button
                        onClick={() => {
                          toggleModal('login', false);
                          toggleModal('register', true);
                        }}
                        className="text-pink-500 hover:text-pink-400 font-semibold"
                      >
                        Sign up
                      </button>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
