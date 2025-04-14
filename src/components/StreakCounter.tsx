
import React from "react";
import { useAppContext } from "@/context/AppContext";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

const StreakCounter: React.FC = () => {
  const { streakCount } = useAppContext();
  
  if (streakCount === 0) {
    return (
      <div className="bg-white rounded-lg p-4 shadow mb-6 text-center">
        <p className="text-muted-foreground">Complete all tasks to start your streak!</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg p-4 shadow mb-6">
      <div className="flex items-center justify-center">
        <div className="mr-3 relative">
          <Flame 
            className={cn(
              "h-8 w-8 text-orange-500",
              streakCount > 0 && "animate-pulse-fire"
            )} 
          />
          {[...Array(Math.min(5, Math.floor(streakCount / 5)))].map((_, i) => (
            <Flame
              key={i}
              className="h-4 w-4 text-orange-500 absolute animate-pulse-fire"
              style={{
                top: `-${(i + 1) * 5}px`,
                left: `${Math.sin(i * 0.5) * 10}px`,
                animationDelay: `${i * 0.2}s`,
                opacity: 0.7,
              }}
            />
          ))}
        </div>
        
        <div className="flex flex-col">
          <span className="text-lg font-bold">{streakCount} Day Streak</span>
          <span className="text-xs text-muted-foreground">
            {streakCount === 1 
              ? "You've completed all tasks for 1 day!" 
              : `You've completed all tasks for ${streakCount} days in a row!`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StreakCounter;
