
export interface Task {
  id: string;
  title: string;
  time: string; // e.g. "6 AM"
  isCompleted: boolean;
  notified: boolean;
  timeInMinutes: number; // minutes from midnight
}

export interface AppState {
  tasks: Task[];
  streakCount: number;
  lastCompletedDay: string | null; // ISO date string for the last day all tasks were completed
  motivationalQuotes: string[];
}
