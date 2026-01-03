import {
  Video,
  Users,
  MessageCircle,
  TrendingUp,
  Eye,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useInstructorData } from "@/hooks/useInstructorData";
import ActivityCalendar from "./ActivityCalendar";
import AnalyticsPieChart from "./AnalyticsPieChart";

interface DashboardTabProps {
  instructorName?: string;
}

const DashboardTab = ({ instructorName = "Instructor" }: DashboardTabProps) => {
  const { data, stats, getActivitiesByDate } = useInstructorData();

  const statCards = [
    {
      icon: Video,
      label: "Total Videos",
      value: stats.totalVideos,
      change: stats.totalVideos > 0 ? `${stats.totalViews} views` : "No data yet",
      changeValue: stats.totalVideos > 0 ? 1 : 0,
    },
    {
      icon: Users,
      label: "Active Students",
      value: stats.activeStudents,
      change: stats.activeStudents > 0 ? "Last 7 days" : "No data yet",
      changeValue: stats.activeStudents > 0 ? 1 : 0,
    },
    {
      icon: MessageCircle,
      label: "Total Doubts",
      value: stats.totalDoubts,
      change: stats.pendingDoubts > 0 ? `${stats.pendingDoubts} pending` : "All resolved",
      changeValue: stats.pendingDoubts > 0 ? -1 : 1,
    },
    {
      icon: TrendingUp,
      label: "Avg Quiz Score",
      value: stats.avgQuizScore > 0 ? `${stats.avgQuizScore}%` : "—",
      change: stats.avgQuizScore > 0 ? `${stats.completionRate}% completion` : "No data yet",
      changeValue: stats.avgQuizScore >= 70 ? 1 : stats.avgQuizScore > 0 ? -1 : 0,
    },
  ];

  // Get recent activities for the activity feed
  const recentActivities = data.activities.slice(0, 5).map((activity, index) => {
    const typeMap: Record<string, "doubt" | "view" | "resolved"> = {
      doubt_received: "doubt",
      video_upload: "view",
      quiz_created: "view",
      doubt_resolved: "resolved",
    };
    return {
      id: index,
      type: typeMap[activity.type] || "view",
      student: activity.title.replace('New doubt from ', '').replace('Uploaded: ', '').replace('Created: ', '').replace('Resolved doubt from ', ''),
      message: activity.details || activity.title,
      time: activity.date,
      video: activity.details || "",
    };
  });

  // Calculate doubt rate (percentage of videos that have doubts)
  const doubtRate = data.videos.length > 0
    ? Math.round((data.videos.filter(v => v.doubts > 0).length / data.videos.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">
                Welcome back, {instructorName}!
              </h2>
              <p className="text-muted-foreground">
                {stats.pendingDoubts > 0 || stats.totalViews > 0 ? (
                  <>
                    You have{" "}
                    {stats.pendingDoubts > 0 && (
                      <span className="font-medium text-foreground">
                        {stats.pendingDoubts} pending doubt{stats.pendingDoubts !== 1 ? "s" : ""}
                      </span>
                    )}
                    {stats.pendingDoubts > 0 && stats.totalViews > 0 && " and "}
                    {stats.totalViews > 0 && (
                      <span className="font-medium text-foreground">
                        {stats.totalViews} total video view{stats.totalViews !== 1 ? "s" : ""}
                      </span>
                    )}
                    .
                  </>
                ) : (
                  "Manage your educational content and track student progress."
                )}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                View All Doubts
              </Button>
              <Button size="sm">Upload New Video</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden group hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                  {stat.changeValue !== 0 ? (
                    <div
                      className={`flex items-center gap-1 text-xs font-medium ${
                        stat.changeValue > 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {stat.changeValue > 0 ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      {stat.change}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">{stat.change}</p>
                  )}
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Calendar Activity View */}
      <ActivityCalendar 
        activities={data.activities} 
        getActivitiesByDate={getActivitiesByDate} 
      />

      {/* Analytics Pie Chart */}
      <AnalyticsPieChart
        completionRate={stats.completionRate}
        doubtRate={doubtRate}
        avgTimeMinutes={stats.avgTimeMinutes}
      />

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivities.length > 0 ? (
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === "doubt"
                        ? "bg-amber-100 dark:bg-amber-900/30"
                        : activity.type === "view"
                        ? "bg-blue-100 dark:bg-blue-900/30"
                        : "bg-green-100 dark:bg-green-900/30"
                    }`}
                  >
                    {activity.type === "doubt" ? (
                      <MessageCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    ) : activity.type === "view" ? (
                      <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-sm">{activity.student}</span>
                      <Badge
                        variant="secondary"
                        className={`text-xs px-2 py-0 ${
                          activity.type === "doubt"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            : activity.type === "view"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        }`}
                      >
                        {activity.type === "doubt"
                          ? "New Doubt"
                          : activity.type === "view"
                          ? "Activity"
                          : "Resolved"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {activity.message}
                    </p>
                    {activity.video && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {activity.video} • {activity.time}
                      </p>
                    )}
                  </div>
                  {activity.type === "doubt" && (
                    <Button variant="outline" size="sm" className="flex-shrink-0">
                      Reply
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">No recent activity</p>
              <p className="text-sm text-muted-foreground mt-1">
                Activity will appear here as students interact with your content
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardTab;
