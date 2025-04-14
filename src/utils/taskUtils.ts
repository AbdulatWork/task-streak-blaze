
import { Task } from "@/types/task";
import { toast } from "sonner";

export const QUOTES = [
  "The only way to do great work is to love what you do.",
  "Success is not final, failure is not fatal: It is the courage to continue that counts.",
  "Believe you can and you're halfway there.",
  "Don't watch the clock; do what it does. Keep going.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Success usually comes to those who are too busy to be looking for it.",
  "The best way to predict the future is to create it.",
  "Don't be afraid to give up the good to go for the great.",
  "Your time is limited, don't waste it living someone else's life.",
  "The harder you work for something, the greater you'll feel when you achieve it."
];

// Convert time like "6 AM" to minutes from midnight
export function timeToMinutes(timeStr: string): number {
  // Extract hours, minutes, and AM/PM
  const regex = /(\d+)(?::(\d+))?\s*(AM|PM)/i;
  const match = timeStr.match(regex);
  
  if (!match) return 0;
  
  let hours = parseInt(match[1], 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const period = match[3].toUpperCase();
  
  // Convert to 24-hour format
  if (period === "PM" && hours < 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  
  return hours * 60 + minutes;
}

// Convert minutes from midnight to a time string (e.g., "6:00 AM")
export function minutesToTime(minutes: number): string {
  let hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? "PM" : "AM";
  
  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;
  
  return `${hours}:${mins.toString().padStart(2, "0")} ${period}`;
}

// Check if it's time to notify for a task
export function shouldNotifyForTask(task: Task): boolean {
  if (task.isCompleted || task.notified) return false;
  
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  return currentMinutes >= task.timeInMinutes;
}

// Schedule a local notification
export function scheduleNotification(task: Task) {
  // This is for browser notifications
  if (Notification.permission === "granted") {
    new Notification(`Task Reminder: ${task.title}`, {
      body: `It's time for your task: ${task.title}`,
      icon: "favicon.ico"
    });
  }
  
  // Display in-app notification
  toast(`Time for: ${task.title}`, {
    description: `Your scheduled task at ${task.time} is now due`,
    duration: 5000,
  });
}

// Get a random quote
export function getRandomQuote(quotes: string[]): string {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

// Check if all tasks have been completed for today
export function areAllTasksCompleted(tasks: Task[]): boolean {
  return tasks.length > 0 && tasks.every(task => task.isCompleted);
}

// Check if the streak should be incremented
export function shouldIncrementStreak(lastCompletedDay: string | null): boolean {
  if (!lastCompletedDay) return true;
  
  const lastDate = new Date(lastCompletedDay);
  const today = new Date();
  
  // Reset date to midnight for comparison
  lastDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  // Check if last completed day was yesterday
  const oneDayInMs = 24 * 60 * 60 * 1000;
  const diffInDays = Math.round((today.getTime() - lastDate.getTime()) / oneDayInMs);
  
  return diffInDays === 1;
}

// Format a date as an ISO date string (YYYY-MM-DD)
export function formatDateToISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Get initial tasks for the user
export function getInitialTasks(): Task[] {
  return [
    {
      id: "1",
      title: "Prayer and Workout",
      time: "6:00 AM",
      isCompleted: false,
      notified: false,
      timeInMinutes: timeToMinutes("6:00 AM"),
    },
    {
      id: "2",
      title: "Data Science Work",
      time: "8:00 AM",
      isCompleted: false,
      notified: false,
      timeInMinutes: timeToMinutes("8:00 AM"),
    },
    {
      id: "3",
      title: "Motivational Quote",
      time: "9:00 AM",
      isCompleted: false,
      notified: false,
      timeInMinutes: timeToMinutes("9:00 AM"),
    },
    {
      id: "4",
      title: "Take a Break",
      time: "11:00 AM",
      isCompleted: false,
      notified: false,
      timeInMinutes: timeToMinutes("11:00 AM"),
    },
    {
      id: "5",
      title: "Prayer and Lunch",
      time: "1:00 PM",
      isCompleted: false,
      notified: false,
      timeInMinutes: timeToMinutes("1:00 PM"),
    },
    {
      id: "6",
      title: "Work Again",
      time: "2:00 PM",
      isCompleted: false,
      notified: false,
      timeInMinutes: timeToMinutes("2:00 PM"),
    },
    {
      id: "7",
      title: "Prayer",
      time: "4:00 PM",
      isCompleted: false,
      notified: false,
      timeInMinutes: timeToMinutes("4:00 PM"),
    },
    {
      id: "8",
      title: "Prayer",
      time: "7:00 PM",
      isCompleted: false,
      notified: false,
      timeInMinutes: timeToMinutes("7:00 PM"),
    },
    {
      id: "9",
      title: "Enjoyment",
      time: "8:00 PM",
      isCompleted: false,
      notified: false,
      timeInMinutes: timeToMinutes("8:00 PM"),
    }
  ];
}
