import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Video, HelpCircle, FileQuestion, CheckCircle2, X } from 'lucide-react';
import { ActivityData } from '@/hooks/useInstructorData';
import { format } from 'date-fns';

interface ActivityCalendarProps {
  activities: ActivityData[];
  getActivitiesByDate: (date: string) => ActivityData[];
}

const activityTypeConfig = {
  video_upload: { icon: Video, label: 'Video Upload', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  quiz_created: { icon: FileQuestion, label: 'Quiz Created', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  doubt_received: { icon: HelpCircle, label: 'Doubt Received', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  doubt_resolved: { icon: CheckCircle2, label: 'Doubt Resolved', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
};

const ActivityCalendar = ({ activities, getActivitiesByDate }: ActivityCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showDetail, setShowDetail] = useState(false);

  const selectedDateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const selectedActivities = selectedDateStr ? getActivitiesByDate(selectedDateStr) : [];

  // Get dates that have activities
  const activityDates = new Set(activities.map(a => a.date));

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setShowDetail(true);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CalendarDays className="w-5 h-5 text-primary" />
          Activity Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Calendar */}
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              className="rounded-lg border border-border p-3"
              modifiers={{
                hasActivity: (date) => activityDates.has(format(date, 'yyyy-MM-dd')),
              }}
              modifiersStyles={{
                hasActivity: {
                  backgroundColor: 'hsl(var(--primary) / 0.15)',
                  fontWeight: 600,
                },
              }}
            />
          </div>

          {/* Activity Detail Panel */}
          <div className="relative">
            {showDetail && selectedDate ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">
                    {format(selectedDate, 'MMMM d, yyyy')}
                  </h4>
                  <button
                    onClick={() => setShowDetail(false)}
                    className="p-1 rounded hover:bg-muted transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                {selectedActivities.length > 0 ? (
                  <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                    {selectedActivities.map((activity) => {
                      const config = activityTypeConfig[activity.type];
                      const IconComponent = config.icon;
                      return (
                        <div
                          key={activity.id}
                          className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border"
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${config.color}`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <Badge variant="secondary" className={`text-xs px-2 py-0 ${config.color}`}>
                                {config.label}
                              </Badge>
                            </div>
                            <p className="text-sm font-medium truncate">{activity.title}</p>
                            {activity.details && (
                              <p className="text-xs text-muted-foreground truncate">{activity.details}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarDays className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No activity on this date</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Select a date to view activities</p>
                <p className="text-xs mt-1">Highlighted dates have recorded activity</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityCalendar;
