import axios from 'axios';

// When running on your phone via Expo Go, "localhost" means the phone itself.
// Use your computer's local IP address instead (find it with ipconfig).
// For iOS simulator, localhost works fine.
const BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// --- Types ---
export type GoalCategory =
  | 'health' | 'career' | 'social' | 'hobbies'
  | 'learning' | 'mental_health' | 'money' | 'custom';

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: GoalCategory;
  status: string;
  frequency: string;
  implementation_intention?: string;
  created_at: string;
  parent_goal_id?: string;
}

export interface Checkin {
  id: string;
  goal_id: string;
  completed: boolean;
  response_text?: string;
  ai_response?: string;
  xp_awarded: number;
  checked_at: string;
}

export interface DashboardStats {
  life_score: number;
  level: {
    current_xp: number;
    level: number;
    title: string;
    xp_to_next: number;
    progress: number;
  };
  completion_7d: number;
  completion_30d: number;
  active_goals: {
    id: string;
    title: string;
    category: string;
    frequency: string;
    streak: number;
    longest_streak: number;
    recent_checkins: { date: string; completed: boolean }[];
  }[];
  streaks: { goal_id: string; current: number; longest: number }[];
  total_streak_days: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// --- Goals ---
export const getGoals = () =>
  api.get<Goal[]>('/goals/').then(r => r.data);

export const createGoal = (data: Partial<Goal>) =>
  api.post<Goal>('/goals/', data).then(r => r.data);

export const updateGoalStatus = (goalId: string, status: string) =>
  api.patch(`/goals/${goalId}/status`, null, { params: { status } }).then(r => r.data);

// --- Check-ins ---
export const createCheckin = (data: {
  goal_id: string;
  completed: boolean;
  response_text?: string;
  ai_response?: string;
  mood_score?: number;
}) => api.post<Checkin>('/checkins/', data).then(r => r.data);

export const getCheckins = (goalId?: string) =>
  api.get<Checkin[]>('/checkins/', { params: goalId ? { goal_id: goalId } : {} }).then(r => r.data);

// --- Chat ---
export const sendChat = (messages: ChatMessage[], mode: 'checkin' | 'goal_setting' | 'highlight_reel' = 'checkin') =>
  api.post<{ reply: string; goal_data?: object }>('/chat/', { messages, mode }).then(r => r.data);

// --- Stats ---
export const getDashboard = () =>
  api.get<DashboardStats>('/stats/dashboard').then(r => r.data);

export const getCompletionGraph = (days = 30) =>
  api.get<{ date: string; total: number; completed: number; rate: number }[]>(
    '/stats/graph', { params: { days } }
  ).then(r => r.data);
