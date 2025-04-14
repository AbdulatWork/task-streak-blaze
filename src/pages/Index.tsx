
import React, { useEffect } from "react";
import { AppProvider } from "@/context/AppContext";
import TaskItem from "@/components/TaskItem";
import AddTaskForm from "@/components/AddTaskForm";
import StreakCounter from "@/components/StreakCounter";
import TaskProgress from "@/components/TaskProgress";
import { useAppContext } from "@/context/AppContext";
import { Flame, ListChecks } from "lucide-react"; // Changed Fire to Flame which is available
import { Separator } from "@/components/ui/separator";

const TaskList: React.FC = () => {
  const { tasks } = useAppContext();
  
  // Sort tasks by time
  const sortedTasks = [...tasks].sort((a, b) => a.timeInMinutes - b.timeInMinutes);
  
  return (
    <div className="space-y-2">
      {sortedTasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
      
      {tasks.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          <p>No tasks added yet. Add your first task!</p>
        </div>
      )}
    </div>
  );
};

const TaskDashboard: React.FC = () => {
  const { resetTasksForToday } = useAppContext();
  
  // Request notification permissions
  useEffect(() => {
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }, []);
  
  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <ListChecks className="h-8 w-8 text-primary mr-2" />
          <h1 className="text-2xl font-bold">Task Streak Blaze</h1>
        </div>
        <Flame className="h-6 w-6 text-orange-500 animate-pulse-fire" /> {/* Changed from Fire to Flame */}
      </div>
      
      <StreakCounter />
      <TaskProgress />
      
      <div className="mb-6">
        <AddTaskForm />
      </div>
      
      <Separator className="my-4" />
      
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Today's Tasks</h2>
        <TaskList />
      </div>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <TaskDashboard />
      </div>
    </AppProvider>
  );
};

export default Index;
