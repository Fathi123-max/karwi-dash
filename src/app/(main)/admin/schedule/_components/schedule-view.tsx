"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { ScheduleCalendar } from "./schedule-calendar";
import { ScheduleManagement } from "./schedule-management";

export function ScheduleView() {
  return (
    <Tabs defaultValue="calendar" className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Schedule Overview</h2>
          <p className="text-muted-foreground">View and manage washer schedules</p>
        </div>
        <TabsList className="grid w-full grid-cols-2 sm:w-auto">
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="management">Schedule Management</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="calendar" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Schedule</CardTitle>
            <CardDescription>View washer schedules by day</CardDescription>
          </CardHeader>
          <CardContent>
            <ScheduleCalendar />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="management" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Manage Schedules</CardTitle>
            <CardDescription>Add, edit, and remove washer schedules</CardDescription>
          </CardHeader>
          <CardContent>
            <ScheduleManagement />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
