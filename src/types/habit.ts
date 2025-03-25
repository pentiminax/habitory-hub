
export type Frequency = 'daily' | 'weekly' | 'monthly';

export interface Habit {
  id: string;
  title: string;
  description?: string;
  frequency: Frequency;
  streak: number;
  color?: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface HabitCompletion {
  id: string;
  habit_id: string;
  user_id: string;
  completed_date: string;
  created_at?: string;
}
