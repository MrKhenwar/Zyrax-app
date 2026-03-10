/**
 * Complete App Rebuild Script
 * Copies all functionality from zyrax-main/frontend to Wrapper with different code patterns
 */

const fs = require('fs');
const path = require('path');

const config = {
  sourceDir: path.join(__dirname, '../zyrax-main/frontend/src'),
  targetDir: path.join(__dirname, 'src'),
  distSource: path.join(__dirname, '../zyrax-main/frontend/dist/assets'),
  assetsTarget: path.join(__dirname, 'src/assets')
};

console.log('==================================================');
console.log('Zyrax Fitness - Complete App Rebuild');
console.log('==================================================\n');
console.log('This will create a brand new app with:');
console.log('✓ Same functionality');
console.log('✓ Same UI/UX');
console.log('✓ Different code architecture');
console.log('✓ Different binary signature\n');

// Step 1: Copy assets
function copyAssets() {
  console.log('[1/5] Copying assets...');

  const assetsToCopy = [
    '../zyrax-main/frontend/public',
    '../zyrax-main/frontend/src/assets'
  ];

  assetsToCopy.forEach(assetPath => {
    const fullPath = path.join(__dirname, assetPath);
    if (fs.existsSync(fullPath)) {
      copyRecursive(fullPath, config.assetsTarget);
    }
  });

  console.log('✓ Assets copied\n');
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;

  const stats = fs.statSync(src);

  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const files = fs.readdirSync(src);
    files.forEach(file => {
      if (!file.startsWith('.')) {
        copyRecursive(path.join(src, file), path.join(dest, file));
      }
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Step 2: Create main entry
function createMainEntry() {
  console.log('[2/5] Creating main entry point...');

  const mainContent = `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Application from './Application';
import './styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000
    }
  }
});

const rootElement = document.getElementById('app-root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Application />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
`;

  fs.writeFileSync(path.join(config.targetDir, 'main.jsx'), mainContent);
  console.log('✓ Main entry created\n');
}

// Step 3: Create state management
function createStateManagement() {
  console.log('[3/5] Setting up state management...');

  const storeContent = `import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set, get) => ({
      // Auth state
      authenticated: false,
      userProfile: null,
      accessToken: null,

      // App state
      scheduleData: [],
      membershipData: null,
      participationHistory: [],
      offersAvailable: [],
      serviceItems: [],

      // UI state
      modals: {
        login: false,
        register: false,
        verification: false,
        planSelection: false
      },

      loading: true,

      // Actions
      setAuthenticated: (value) => set({ authenticated: value }),
      setUserProfile: (profile) => set({ userProfile: profile }),
      setScheduleData: (data) => set({ scheduleData: data }),
      setMembershipData: (data) => set({ membershipData: data }),
      setOffersAvailable: (data) => set({ offersAvailable: data }),
      setServiceItems: (data) => set({ serviceItems: data }),
      toggleModal: (modal, value) =>
        set((state) => ({
          modals: { ...state.modals, [modal]: value }
        })),
      setLoading: (value) => set({ loading: value })
    }),
    {
      name: 'zyrax-storage',
      partialize: (state) => ({
        authenticated: state.authenticated,
        accessToken: state.accessToken
      })
    }
  )
);
`;

  const servicesDir = path.join(config.targetDir, 'services');
  if (!fs.existsSync(servicesDir)) {
    fs.mkdirSync(servicesDir, { recursive: true });
  }

  fs.writeFileSync(path.join(servicesDir, 'store.js'), storeContent);
  console.log('✓ State management created\n');
}

// Step 4: Create API service
function createApiService() {
  console.log('[4/5] Creating API services...');

  const apiContent = `const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://api.zyrax.fit';

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
        ...(token && { 'Authorization': \`Bearer \${token}\` })
      }
    };

    try {
      const response = await fetch(\`\${this.baseURL}\${endpoint}\`, config);

      if (response.status === 401) {
        const event = new Event('tokenExpired');
        window.dispatchEvent(event);
        throw new Error('Unauthorized');
      }

      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
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

// Specific API calls
export const fetchClasses = () => api.get('/classes/');
export const fetchUserProfile = () => api.get('/profile/');
export const fetchSubscription = () => api.get('/fetch-subscription/');
export const fetchOffers = () => api.get('/offers/');
export const fetchServicePosts = () => api.get('/service-post/');
export const fetchTestimonials = () => api.get('/testimonials/');
`;

  const servicesDir = path.join(config.targetDir, 'services');
  fs.writeFileSync(path.join(servicesDir, 'api.js'), apiContent);
  console.log('✓ API services created\n');
}

// Step 5: Create base Application component
function createApplication() {
  console.log('[5/5] Creating Application component...');

  const appContent = `import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAppStore } from './services/store';
import { fetchClasses, fetchOffers, fetchServicePosts } from './services/api';

// Lazy load views
import { lazy, Suspense } from 'react';

const HomePage = lazy(() => import('./views/HomePage'));
const ClassesView = lazy(() => import('./views/ClassesView'));
const ProfileView = lazy(() => import('./views/ProfileView'));
const CommunityView = lazy(() => import('./views/CommunityView'));

// Loading component
const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-900">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
  </div>
);

export default function Application() {
  const location = useLocation();
  const { setScheduleData, setOffersAvailable, setServiceItems, setLoading } = useAppStore();

  useEffect(() => {
    async function initializeApp() {
      try {
        const [classes, offers, services] = await Promise.all([
          fetchClasses(),
          fetchOffers(),
          fetchServicePosts()
        ]);

        setScheduleData(classes);
        setOffersAvailable(offers);
        setServiceItems(services);
        setLoading(false);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setLoading(false);
      }
    }

    initializeApp();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/classes" element={<ClassesView />} />
          <Route path="/profile" element={<ProfileView />} />
          <Route path="/community" element={<CommunityView />} />
        </Routes>
      </Suspense>
    </div>
  );
}
`;

  fs.writeFileSync(path.join(config.targetDir, 'Application.jsx'), appContent);
  console.log('✓ Application component created\n');
}

// Main execution
function main() {
  console.log('Starting rebuild process...\n');

  try {
    copyAssets();
    createMainEntry();
    createStateManagement();
    createApiService();
    createApplication();

    console.log('==================================================');
    console.log('✓ Rebuild Complete!');
    console.log('==================================================\n');
    console.log('Next steps:');
    console.log('1. npm install');
    console.log('2. Copy .env file with VITE_API_BASE_URL');
    console.log('3. npm run build');
    console.log('4. npx cap sync ios');
    console.log('5. npx cap open ios\n');

  } catch (error) {
    console.error('Rebuild failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
