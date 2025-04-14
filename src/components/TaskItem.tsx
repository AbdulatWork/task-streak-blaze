
import React from "react";
import { Task } from "@/types/task";
import { Check, Clock, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { completeTask, uncompleteTask, deleteTask } = useAppContext();
  
  const handleTaskToggle = () => {
    if (task.isCompleted) {
      uncompleteTask(task.id);
    } else {
      completeTask(task.id);
    }
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTask(task.id);
  };
  
  return (
    <Card 
      className={cn(
        "animate-slide-in mb-3 p-4 cursor-pointer transition-all duration-300 hover:shadow-md",
        task.isCompleted ? "bg-muted border-green-300" : "bg-white"
      )}
      onClick={handleTaskToggle}
      style={{ animationDelay: `${parseInt(task.id) * 50}ms` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button 
            variant={task.isCompleted ? "default" : "outline"}
            size="icon"
            className={cn(
              "h-8 w-8 rounded-full transition-colors duration-300",
              task.isCompleted && "bg-green-500 hover:bg-green-600"
            )}
            onClick={handleTaskToggle}
          >
            {task.isCompleted && <Check className="h-4 w-4" />}
          </Button>
          
          <div className="flex flex-col">
            <span className={cn(
              "font-medium transition-all duration-300",
              task.isCompleted && "line-through text-muted-foreground"
            )}>
              {task.title}
            </span>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-1 h-3 w-3" /> {task.time}
            </div>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={handleDelete}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default TaskItem;
