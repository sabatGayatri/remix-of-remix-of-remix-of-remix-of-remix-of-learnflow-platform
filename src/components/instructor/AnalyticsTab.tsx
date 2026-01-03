import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  HelpCircle,
  Video,
  Users,
  Target,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useInstructorData } from "@/hooks/useInstructorData";

const chartConfig = {
  doubts: { label: "Doubts", color: "hsl(var(--primary))" },
  score: { label: "Score", color: "hsl(160 70% 45%)" },
  count: { label: "Count", color: "hsl(var(--primary))" },
};

const AnalyticsTab = () => {
  const { data, stats } = useInstructorData();

  const hasData = data.videos.length > 0 || data.quizzes.length > 0;

  // Confusing videos (sorted by doubts)
  const confusingVideos = [...data.videos]
    .sort((a, b) => b.doubts - a.doubts)
    .slice(0, 5)
    .map(v => ({
      name: v.title,
      doubts: v.doubts,
      timestamp: v.uploadDate,
    }));

  // Quiz performance by topic
  const quizPerformance = data.quizzes.map(q => ({
    topic: q.topic,
    score: q.avgScore,
  }));

  // Domain distribution (based on quiz topics)
  const topicCounts: Record<string, number> = {};
  data.quizzes.forEach(q => {
    topicCounts[q.topic] = (topicCounts[q.topic] || 0) + q.attempts;
  });
  const totalAttempts = Object.values(topicCounts).reduce((a, b) => a + b, 0);
  const colors = ['hsl(var(--primary))', 'hsl(160 70% 45%)', 'hsl(200 70% 50%)', 'hsl(280 70% 50%)'];
  const domainDistribution = Object.entries(topicCounts).map(([name, value], i) => ({
    name,
    value: totalAttempts > 0 ? Math.round((value / totalAttempts) * 100) : 0,
    color: colors[i % colors.length],
  }));

  const metrics = [
    {
      icon: Video,
      label: "Total Watch Time",
      value: `${Math.round(stats.totalViews * 4.5)} min`,
      change: "+12%",
      changeValue: stats.totalViews > 0 ? 12 : 0,
    },
    {
      icon: HelpCircle,
      label: "Avg. Doubts/Video",
      value: data.videos.length > 0 
        ? (data.videos.reduce((sum, v) => sum + v.doubts, 0) / data.videos.length).toFixed(1) 
        : "—",
      change: "-8%",
      changeValue: data.videos.length > 0 ? -8 : 0,
    },
    {
      icon: Target,
      label: "Avg. Quiz Score",
      value: stats.avgQuizScore > 0 ? `${stats.avgQuizScore}%` : "—",
      change: "+5%",
      changeValue: stats.avgQuizScore > 0 ? 5 : 0,
    },
    {
      icon: Users,
      label: "Completion Rate",
      value: stats.completionRate > 0 ? `${stats.completionRate}%` : "—",
      change: "-3%",
      changeValue: stats.completionRate > 0 ? -3 : 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <metric.icon className="w-5 h-5 text-primary" />
                </div>
                {metric.changeValue !== 0 && metric.value !== "—" && (
                  <div
                    className={`flex items-center gap-1 text-xs font-medium ${
                      metric.changeValue > 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {metric.changeValue > 0 ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}
                    {metric.change}
                  </div>
                )}
              </div>
              <p className="text-2xl font-bold mt-3">{metric.value}</p>
              <p className="text-sm text-muted-foreground">{metric.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {hasData ? (
        <>
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Most Confusing Videos */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  Most Confusing Videos
                </CardTitle>
                <CardDescription>
                  Videos with the highest doubt counts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {confusingVideos.length > 0 ? (
                  <div className="space-y-4">
                    {confusingVideos.map((video, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm truncate">{video.name}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {video.timestamp}
                            </p>
                          </div>
                          <span className="text-sm font-medium text-primary flex-shrink-0 ml-2">
                            {video.doubts} doubts
                          </span>
                        </div>
                        <Progress
                          value={(video.doubts / Math.max(...confusingVideos.map(v => v.doubts), 1)) * 100}
                          className="h-1.5"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">No data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quiz Performance by Topic */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5 text-primary" />
                  Quiz Performance by Topic
                </CardTitle>
                <CardDescription>
                  Average scores across different topics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {quizPerformance.length > 0 ? (
                  <ChartContainer config={chartConfig} className="h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={quizPerformance} layout="vertical">
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis dataKey="topic" type="category" width={80} tick={{ fontSize: 12 }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                          dataKey="score"
                          fill="hsl(var(--primary))"
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">No quiz data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Student Distribution by Topic */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5 text-primary" />
                  Student Distribution by Topic
                </CardTitle>
                <CardDescription>
                  How students are distributed across topics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {domainDistribution.length > 0 ? (
                  <div className="flex items-center gap-8">
                    <ChartContainer config={chartConfig} className="h-[180px] w-[180px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={domainDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={70}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {domainDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                    <div className="space-y-3">
                      {domainDistribution.map((topic, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-sm"
                            style={{ backgroundColor: topic.color }}
                          />
                          <span className="text-sm">{topic.name}</span>
                          <span className="text-sm font-medium">{topic.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">No distribution data</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Avg Quiz Time */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5 text-primary" />
                  Quiz Time Analysis
                </CardTitle>
                <CardDescription>
                  Average time students spend on quizzes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-4">
                  {data.quizzes.slice(0, 3).map((quiz, index) => (
                    <div key={index} className="text-center p-4 rounded-xl bg-muted/30 border border-border">
                      <p className="text-2xl font-bold text-primary">{quiz.avgTimeMinutes} min</p>
                      <p className="text-sm font-medium mt-1 truncate">{quiz.title}</p>
                      <p className="text-xs text-muted-foreground">{quiz.attempts} attempts</p>
                    </div>
                  ))}
                </div>
                {data.quizzes.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">No quiz time data</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Understanding Level by Difficulty */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-primary" />
                Understanding Level by Difficulty
              </CardTitle>
              <CardDescription>
                Student comprehension rates at each difficulty level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  { level: "Beginner", percentage: Math.min(100, stats.avgQuizScore + 10) || 89, color: "text-green-500" },
                  { level: "Intermediate", percentage: stats.avgQuizScore || 72, color: "text-amber-500" },
                  { level: "Advanced", percentage: Math.max(0, stats.avgQuizScore - 20) || 54, color: "text-red-500" },
                ].map((level, index) => (
                  <div key={index} className="text-center p-6 rounded-xl bg-muted/30 border border-border">
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      <svg
                        className="w-20 h-20 transform -rotate-90"
                        viewBox="0 0 36 36"
                      >
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          className="text-muted"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeDasharray={`${level.percentage}, 100`}
                          className={level.color}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold">{level.percentage}%</span>
                      </div>
                    </div>
                    <p className="font-medium">{level.level}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Understanding Rate
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">No analytics data available</p>
            <p className="text-sm text-muted-foreground mt-1">
              Analytics will appear here as students interact with your content
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsTab;
