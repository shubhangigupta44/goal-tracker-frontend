import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from './useAuthStore';

const API_URL = 'http://localhost:5000/api/goals';

const useGoalStore = create((set, get) => ({
  goals: [],
  isLoading: false,
  error: null,

  fetchGoals: async () => {
    set({ isLoading: true, error: null });
    try {
      const { user } = useAuthStore.getState();
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const response = await axios.get(API_URL, config);
      set({ goals: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch goals', isLoading: false });
    }
  },

  createGoal: async (goalData) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = useAuthStore.getState();
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const response = await axios.post(API_URL, goalData, config);
      set((state) => ({ goals: [...state.goals, response.data], isLoading: false }));
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create goal', isLoading: false });
      return false;
    }
  },

  submitGoals: async () => {
    set({ isLoading: true, error: null });
    try {
      const { user } = useAuthStore.getState();
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      await axios.post(`${API_URL}/submit`, {}, config);
      // Refresh goals after submission
      await get().fetchGoals();
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to submit goals', isLoading: false });
      return false;
    }
  },
  
  approveGoal: async (goalId, approvalData) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = useAuthStore.getState();
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const response = await axios.put(`${API_URL}/${goalId}/approve`, approvalData, config);
      
      set((state) => ({
        goals: state.goals.map((goal) => (goal._id === goalId ? response.data : goal)),
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to approve/reject', isLoading: false });
      return false;
    }
  }
}));

export default useGoalStore;
