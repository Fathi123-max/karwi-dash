"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Plus, Calendar, Clock, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { useWasherScheduleStore } from "@/stores/admin-dashboard/washer-schedule-store";
import { useWasherStore } from "@/stores/admin-dashboard/washer-store";
import { ScheduleDetail } from "./types";

export function ScheduleManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedWasherId, setSelectedWasherId] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<number>(1); // Monday default
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("17:00");
  
  const { washers } = useWasherStore();
  const { schedules, addSchedule, deleteSchedule } = useWasherScheduleStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedWasherId) {
      toast.error("Please select a washer");
      return;
    }

    try {
      await addSchedule({
        washer_id: selectedWasherId,
        day_of_week: selectedDay,
        start_time: startTime,
        end_time: endTime,
      });
      
      toast.success("Schedule added successfully");
      setIsDialogOpen(false);
      // Reset form
      setSelectedWasherId("");
      setSelectedDay(1);
      setStartTime("09:00");
      setEndTime("17:00");
    } catch (error) {
      toast.error("Failed to add schedule");
      console.error(error);
    }
  };

  // Get schedules grouped by day
  const getSchedulesByDay = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const grouped: { [key: number]: ScheduleDetail[] } = {};
    
    days.forEach((_, index) => {
      grouped[index] = [];
    });

    schedules.forEach((schedule) => {
      const washer = washers.find(w => w.id === schedule.washer_id);
      if (washer) {
        grouped[schedule.day_of_week].push({
          id: schedule.id,
          washer,
          startTime: schedule.start_time,
          endTime: schedule.end_time,
        });
      }
    });

    return grouped;
  };

  const schedulesByDay = getSchedulesByDay();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Weekly Schedule Management</h3>
          <p className="text-muted-foreground text-sm">
            Add and manage washer schedules for each day of the week
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Schedule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Schedule</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="washer">Washer</Label>
                <Select value={selectedWasherId} onValueChange={setSelectedWasherId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a washer" />
                  </SelectTrigger>
                  <SelectContent>
                    {washers.map((washer) => (
                      <SelectItem key={washer.id} value={washer.id}>
                        {washer.name} ({washer.branch})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="day">Day of Week</Label>
                <Select 
                  value={selectedDay.toString()} 
                  onValueChange={(value) => setSelectedDay(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Sunday</SelectItem>
                    <SelectItem value="1">Monday</SelectItem>
                    <SelectItem value="2">Tuesday</SelectItem>
                    <SelectItem value="3">Wednesday</SelectItem>
                    <SelectItem value="4">Thursday</SelectItem>
                    <SelectItem value="5">Friday</SelectItem>
                    <SelectItem value="6">Saturday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="start-time"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="end-time">End Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="end-time"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Schedule</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Weekly Schedule View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Object.entries(schedulesByDay).map(([dayIndex, daySchedules]) => {
          const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][parseInt(dayIndex)];
          
          return (
            <Card key={dayIndex} className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-base">
                  <Calendar className="mr-2 h-4 w-4" />
                  {dayName}
                </CardTitle>
                <CardDescription>
                  {daySchedules.length} {daySchedules.length === 1 ? 'schedule' : 'schedules'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                {daySchedules.length > 0 ? (
                  <div className="space-y-3">
                    {daySchedules.map((schedule) => (
                      <div 
                        key={schedule.id} 
                        className="p-3 border rounded-lg bg-muted/50 relative"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={async () => {
                            try {
                              await deleteSchedule(schedule.id);
                              toast.success("Schedule deleted successfully");
                            } catch (error) {
                              toast.error("Failed to delete schedule");
                              console.error(error);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">{schedule.washer.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {schedule.washer.branch}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-mono">
                              {schedule.startTime} - {schedule.endTime}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground text-center text-sm">
                      No schedules
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}