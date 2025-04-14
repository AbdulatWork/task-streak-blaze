
import React, { useMemo } from "react";
import { useAppContext } from "@/context/AppContext";
import { Progress } from "@/components/ui/progress";

const TaskProgress: React.FC = () => {
  const { tasks } = useAppContext();
  
  const { completedCount, totalCount, progressPercentage } = useMemo(() => {
    const totalCount = tasks.length;
    const completedCount = tasks.filter(task => task.isCompleted).length;
    const progressPercentage = totalCount === 0 
      ? 0 
      : Math.floor((completedCount / totalCount) * 100);
    
    return { completedCount, totalCount, progressPercentage };
  }, [tasks]);
  
  return (
    <div className="bg-white rounded-lg p-4 shadow mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Daily Progress</span>
        <span className="text-sm text-muted-foreground">
          {completedCount}/{totalCount} Tasks
        </span>
      </div>
      <Progress 
        value={progressPercentage}
        className="h-2" 
      />
      <div className="mt-2 text-xs text-muted-foreground text-center">
        {progressPercentage === 100 
          ? "All tasks completed for today! 🎉" 
          : `${progressPercentage}% completed`}
      </div>
    </div>
  );
};

export default TaskProgress;
