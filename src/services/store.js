import { create } from 'zustand';
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
