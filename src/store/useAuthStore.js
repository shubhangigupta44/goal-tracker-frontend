import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('user', JSON.stringify(response.data));
      set({ user: response.data, isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Login failed', isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    set({ user: null });
  },
}));

export default useAuthStore;
