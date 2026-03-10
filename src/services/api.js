// API Client for Zyrax Fitness Backend
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://api.zyrax.fit/zyrax';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE;
    this.defaultHeaders = {
      'Content-Type': 'application/json'
    };
  }

  async request(endpoint, options = {}) {
    const token = localStorage.getItem('accessToken');

    const config = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);

      if (response.status === 401) {
        // Try to refresh token
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry request with new token
          const newToken = localStorage.getItem('accessToken');
          config.headers.Authorization = `Bearer ${newToken}`;
          const retryResponse = await fetch(`${this.baseURL}${endpoint}`, config);
          if (retryResponse.ok) {
            return await retryResponse.json();
          }
        }
        // If refresh failed, dispatch token expired event
        window.dispatchEvent(new Event('tokenExpired'));
        throw new Error('Unauthorized');
      }

      // Parse response body for both success and error cases
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        // Create an error with response data attached
        const error = new Error(`HTTP error! status: ${response.status}`);
        error.response = {
          status: response.status,
          data: data
        };
        throw error;
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseURL}/token/refresh/`, {
        method: 'POST',
        headers: this.defaultHeaders,
        body: JSON.stringify({ refresh: refreshToken })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.access);
        if (data.refresh) {
          localStorage.setItem('refreshToken', data.refresh);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  get(endpoint, options) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, data, options) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  put(endpoint, data, options) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  delete(endpoint, options) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiClient();

// ==================== AUTH APIs ====================
export const loginUser = (username, password, deviceInfo) =>
  api.post('/login/', { username, password, device_info: deviceInfo });
export const loginWithOTP = (phoneNumber) =>
  api.post('/login/request-otp/', { phone_number: phoneNumber });
export const verifyLoginOTP = (phoneNumber, otp, deviceInfo) =>
  api.post('/login/verify-otp/', { phone_number: phoneNumber, otp, device_info: deviceInfo });
export const registerUser = (userData) => api.post('/register/', userData);
export const requestOTP = (phoneNumber) => api.post('/request-otp/', { phone_number: phoneNumber });
export const verifyOTP = (phoneNumber, otp) => api.post('/verify-otp/', { phone_number: phoneNumber, otp });

// ==================== CLASSES APIs ====================
export const fetchClasses = () => api.get('/classes/');
export const joinClass = (classId) => api.post('/classes/join/', { class_id: classId });
export const fetchVideos = () => api.get('/videoUrl/');

// ==================== PROFILE APIs ====================
export const fetchUserProfile = () => api.get('/profile/details/');
export const updateProfile = (data) => api.put('/profile/update/', data);

// ==================== MEMBERSHIP & SUBSCRIPTION APIs ====================
export const fetchSubscription = () => api.get('/fetch-subscription/');
export const fetchOffers = () => api.get('/offers/');
export const fetchMembership = () => api.get('/membership/');

// ==================== COMMUNITY APIs ====================
export const fetchCommunityPosts = () => api.get('/community/posts/');
export const createCommunityPost = (data) => api.post('/community/posts/', data);
export const fetchServicePosts = () => api.get('/service-post/');

// ==================== DIET APIs ====================
export const fetchDietPDFs = () => api.get('/diet-pdfs/');
export const fetchMealPlans = () => api.get('/meal-plans/');

// ==================== GENERAL APIs ====================
export const fetchFAQs = () => api.get('/faq/');
export const fetchTestimonials = () => api.get('/testimonials/');

// ==================== TRIAL APIs ====================
export const registerTrial = (data) => api.post('/trial/register/', data);
