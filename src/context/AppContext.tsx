import React, { createContext, useContext, useEffect, useState } from "react";
import { AppState, Task } from "@/types/task";
import { 
  getInitialTasks, 
  QUOTES, 
  shouldNotifyForTask, 
  scheduleNotification, 
  areAllTasksCompleted, 
  shouldIncrementStreak,
  formatDateToISODate,
  getRandomQuote
} from "@/utils/taskUtils";
import { toast } from "sonner";
import { useToast } from "@/components/ui/use-toast";

interface AppContextType extends AppState {
  addTask: (task: Omit<Task, "id" | "notified" | "timeInMinutes">) => void;
  completeTask: (id: string) => void;
  uncompleteTask: (id: string) => void;
  deleteTask: (id: string) => void;
  resetTasksForToday: () => void;
  getProgressForDate: (date: string) => number;
}

const defaultAppState: AppState = {
  tasks: [],
  streakCount: 0,
  lastCompletedDay: null,
  motivationalQuotes: QUOTES,
  completedDates: {}, // New state to track progress by date
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    // Load from localStorage if available
    const savedState = localStorage.getItem('taskTrackerState');
    if (savedState) {
      return JSON.parse(savedState);
    }
    
    // Otherwise, initialize with default values
    return {
      ...defaultAppState,
      tasks: getInitialTasks(),
    };
  });
  
  const { toast: showToast } = useToast();
  
  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('taskTrackerState', JSON.stringify(state));
  }, [state]);
  
  // Check for pending notifications every minute
  useEffect(() => {
    // Request notification permission
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
    
    // Set up interval to check for tasks that need notifications
    const checkInterval = setInterval(() => {
      let updatedTasks = [...state.tasks];
      let tasksNeedingNotification = false;
      
      updatedTasks = updatedTasks.map(task => {
        if (shouldNotifyForTask(task)) {
          scheduleNotification(task);
          tasksNeedingNotification = true;
          return { ...task, notified: true };
        }
        return task;
      });
      
      if (tasksNeedingNotification) {
        setState(prevState => ({
          ...prevState,
          tasks: updatedTasks
        }));
      }
      
      // Special case for motivational quote at 9 AM
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      
      if (hours === 9 && minutes === 0) {
        // Find the motivational quote task
        const quoteTask = updatedTasks.find(t => t.title === "Motivational Quote");
        if (quoteTask && !quoteTask.notified) {
          const quote = getRandomQuote(state.motivationalQuotes);
          toast(quote, {
            description: "Your daily motivational quote",
            duration: 10000,
          });
        }
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(checkInterval);
  }, [state.tasks, state.motivationalQuotes]);
  
  // Reset tasks at midnight
  useEffect(() => {
    const now = new Date();
    const timeToMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    ).getTime() - now.getTime();
    
    const midnightReset = setTimeout(() => {
      resetTasksForToday();
    }, timeToMidnight);
    
    return () => clearTimeout(midnightReset);
  }, []);
  
  // Add a new task
  const addTask = (task: Omit<Task, "id" | "notified" | "timeInMinutes">) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      notified: false,
      timeInMinutes: 0, // This will be calculated from the time string
    };
    
    setState(prevState => ({
      ...prevState,
      tasks: [...prevState.tasks, newTask]
    }));
  };
  
  // Mark a task as completed
  const completeTask = (id: string) => {
    const updatedTasks = state.tasks.map(task => 
      task.id === id ? { ...task, isCompleted: true } : task
    );
    
    const allCompleted = areAllTasksCompleted(updatedTasks);
    let newStreakCount = state.streakCount;
    let newLastCompletedDay = state.lastCompletedDay;
    
    // Update the progress for today
    const today = formatDateToISODate(new Date());
    const totalTasks = updatedTasks.length;
    const completedCount = updatedTasks.filter(task => task.isCompleted).length;
    const progress = totalTasks > 0 ? completedCount / totalTasks : 0;
    
    // Update the completed dates object with today's progress
    const newCompletedDates = {
      ...state.completedDates,
      [today]: progress
    };
    
    if (allCompleted) {
      // If this is a new day completion
      if (state.lastCompletedDay !== today) {
        if (shouldIncrementStreak(state.lastCompletedDay)) {
          newStreakCount = state.streakCount + 1;
          
          // Show streak animation
          showToast({
            title: "Streak Extended!",
            description: `You've completed all tasks for ${newStreakCount} days in a row!`,
          });
          
          toast("🔥 Streak Extended!", {
            description: `You've completed all tasks for ${newStreakCount} days in a row!`,
            duration: 5000,
          });
        } else if (!state.lastCompletedDay) {
          // First time completing all tasks
          newStreakCount = 1;
          
          toast("🔥 Streak Started!", {
            description: "You've completed all tasks for the day!",
            duration: 5000,
          });
        }
        
        newLastCompletedDay = today;
      }
    }
    
    setState(prevState => ({
      ...prevState,
      tasks: updatedTasks,
      streakCount: newStreakCount,
      lastCompletedDay: newLastCompletedDay,
      completedDates: newCompletedDates
    }));
  };
  
  // Unmark a task as completed
  const uncompleteTask = (id: string) => {
    const updatedTasks = state.tasks.map(task => 
      task.id === id ? { ...task, isCompleted: false } : task
    );
    
    // Update the progress for today
    const today = formatDateToISODate(new Date());
    const totalTasks = updatedTasks.length;
    const completedCount = updatedTasks.filter(task => task.isCompleted).length;
    const progress = totalTasks > 0 ? completedCount / totalTasks : 0;
    
    // Update the completed dates object with today's progress
    const newCompletedDates = {
      ...state.completedDates,
      [today]: progress
    };
    
    setState(prevState => ({
      ...prevState,
      tasks: updatedTasks,
      completedDates: newCompletedDates
    }));
  };
  
  // Delete a task
  const deleteTask = (id: string) => {
    setState(prevState => ({
      ...prevState,
      tasks: prevState.tasks.filter(task => task.id !== id)
    }));
  };
  
  // Reset tasks for the next day
  const resetTasksForToday = () => {
    setState(prevState => ({
      ...prevState,
      tasks: prevState.tasks.map(task => ({
        ...task,
        isCompleted: false,
        notified: false
      }))
    }));
    
    toast("New Day Started", {
      description: "Your tasks have been reset for today!",
      duration: 5000,
    });
  };
  
  // Get progress for a specific date
  const getProgressForDate = (date: string): number => {
    return state.completedDates[date] || 0;
  };
  
  const contextValue: AppContextType = {
    ...state,
    addTask,
    completeTask,
    uncompleteTask,
    deleteTask,
    resetTasksForToday,
    getProgressForDate
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
