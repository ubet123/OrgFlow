import { create } from 'zustand';

const useAuth = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null })
}));

export default useAuth;
