
import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { timeToMinutes } from "@/utils/taskUtils";

const AddTaskForm: React.FC = () => {
  const { addTask } = useAppContext();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [timeError, setTimeError] = useState("");
  
  const validateTime = (timeStr: string): boolean => {
    const timeRegex = /^(1[0-2]|0?[1-9]):([0-5][0-9]) (AM|PM)$/i;
    const valid = timeRegex.test(timeStr);
    setTimeError(valid ? "" : "Please enter a valid time (e.g., 6:00 AM)");
    return valid;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }
    
    if (!validateTime(time)) {
      return;
    }
    
    addTask({ 
      title, 
      time,
      isCompleted: false,
      timeInMinutes: timeToMinutes(time)
    });
    
    setTitle("");
    setTime("");
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full gap-2">
          <Plus className="h-4 w-4" /> Add New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">Task Time</Label>
              <Input
                id="time"
                placeholder="e.g., 6:00 AM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
              {timeError && (
                <p className="text-sm text-red-500">{timeError}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={!title.trim() || !validateTime(time)}
            >
              Add Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskForm;
