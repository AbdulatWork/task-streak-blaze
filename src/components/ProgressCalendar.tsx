
import React, { useMemo, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarCheck, ChevronDown } from "lucide-react";
import { formatDateToISODate } from "@/utils/taskUtils";
import { cn } from "@/lib/utils";

const ProgressCalendar: React.FC = () => {
  const { tasks, getProgressForDate, completedDates } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  
  // Use the current date as the default selected date
  const [month, setMonth] = useState<Date>(new Date());
  
  const calendarWithProgress = useMemo(() => {
    // Create a function that adds custom styling to each date based on completion
    return (
      <Calendar
        mode="single"
        month={month}
        onMonthChange={setMonth}
        className="rounded-md border"
        classNames={{
          day_selected: "bg-primary !text-primary-foreground hover:bg-primary/90",
          day: "focus-visible:bg-primary focus-visible:text-primary-foreground",
        }}
        modifiers={{
          // This allows us to apply custom styling to dates with tasks
          booked: Object.keys(completedDates).map(date => new Date(date)),
        }}
        modifiersClassNames={{
          booked: "booked-day", // We'll use this as a hook for styling
        }}
        components={{
          Day: ({ date, ...props }) => {
            const dateString = formatDateToISODate(date);
            const progress = getProgressForDate(dateString);
            
            // Skip if not in the current month
            if (date.getMonth() !== month.getMonth()) {
              return <Calendar.Day date={date} {...props} />;
            }
            
            // Define colors based on progress
            let className = "";
            
            if (progress > 0) {
              if (progress < 0.33) {
                className = "bg-red-100 text-red-900"; // Low progress
              } else if (progress < 0.66) {
                className = "bg-orange-100 text-orange-900"; // Medium progress
              } else if (progress < 1) {
                className = "bg-yellow-100 text-yellow-900"; // Good progress
              } else {
                className = "bg-green-100 text-green-900"; // Complete
              }
            }
            
            return (
              <Calendar.Day 
                date={date} 
                {...props}
                className={cn(props.className, className)} 
                disabled={false}
              />
            );
          },
        }}
      />
    );
  }, [month, completedDates, getProgressForDate]);

  return (
    <div className="bg-white rounded-lg p-4 shadow mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <CalendarCheck className="h-5 w-5 text-primary mr-2" />
          <h3 className="text-md font-medium">Progress Calendar</h3>
        </div>
        
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              View Calendar
              <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            {calendarWithProgress}
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex justify-between text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded bg-red-100 mr-1"></div>
          <span>Low (0-33%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded bg-orange-100 mr-1"></div>
          <span>Medium (34-65%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded bg-yellow-100 mr-1"></div>
          <span>Good (66-99%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded bg-green-100 mr-1"></div>
          <span>Complete (100%)</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressCalendar;
