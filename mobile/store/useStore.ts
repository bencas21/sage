// Zustand is like a global useState that any component can read/write.
// No prop drilling, no Context boilerplate — just import and use.
import { create } from 'zustand';
import { DashboardStats, Goal, ChatMessage } from '../services/api';

interface AppState {
  // Dashboard
  stats: DashboardStats | null;
  setStats: (stats: DashboardStats) => void;

  // Goals
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;

  // Chat
  chatMessages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  clearChat: () => void;
  chatMode: 'checkin' | 'goal_setting' | 'highlight_reel';
  setChatMode: (mode: AppState['chatMode']) => void;

  // Loading states
  isLoading: boolean;
  setLoading: (val: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  stats: null,
  setStats: (stats) => set({ stats }),

  goals: [],
  setGoals: (goals) => set({ goals }),

  chatMessages: [],
  addMessage: (msg) => set((state) => ({ chatMessages: [...state.chatMessages, msg] })),
  clearChat: () => set({ chatMessages: [] }),
  chatMode: 'checkin',
  setChatMode: (mode) => set({ chatMode: mode }),

  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),
}));
