import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { 
  BookOpen, 
  Trophy, 
  Clock, 
  Target, 
  TrendingUp, 
  Brain,
  CheckCircle2,
  ArrowRight,
  Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const weeklyData = [
  { day: "Mon", problems: 5 },
  { day: "Tue", problems: 8 },
  { day: "Wed", problems: 3 },
  { day: "Thu", problems: 12 },
  { day: "Fri", problems: 7 },
  { day: "Sat", problems: 15 },
  { day: "Sun", problems: 10 },
];

const recentProblems = [
  { title: "Two Sum", domain: "DSA", difficulty: "Easy", completed: true },
  { title: "Best Time to Buy Stock", domain: "DSA", difficulty: "Easy", completed: true },
  { title: "Maximum Subarray", domain: "DSA", difficulty: "Medium", completed: false },
  { title: "Percentages Basics", domain: "Aptitude", difficulty: "Easy", completed: true },
];

const weakTopics = [
  { name: "Dynamic Programming", score: 35, total: 65 },
  { name: "Graphs", score: 42, total: 48 },
  { name: "System Design", score: 28, total: 35 },
];

const Dashboard = () => {
  const maxProblems = Math.max(...weeklyData.map(d => d.problems));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-1">Welcome back, Student! 👋</h1>
              <p className="text-muted-foreground">Track your progress and keep learning.</p>
            </div>
            <Link to="/domains">
              <Button variant="default" className="gap-2">
                Continue Learning
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Stats Overview */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: BookOpen, label: "Problems Solved", value: "127", change: "+12 this week", color: "text-blue-500" },
              { icon: Trophy, label: "Quiz Score Avg", value: "85%", change: "+5% improvement", color: "text-yellow-500" },
              { icon: Clock, label: "Time Spent", value: "48h", change: "This month", color: "text-green-500" },
              { icon: Flame, label: "Current Streak", value: "12 days", change: "Keep it up!", color: "text-orange-500" },
            ].map((stat, index) => (
              <div key={index} className="dashboard-stat group">
                <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                <div className="text-xs text-primary mt-2">{stat.change}</div>
                <stat.icon className="dashboard-stat-icon" />
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Weekly Activity Chart */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Weekly Activity
                </h2>
                <span className="text-sm text-muted-foreground">60 problems this week</span>
              </div>

              <div className="flex items-end justify-between h-40 gap-2">
                {weeklyData.map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col justify-end h-32">
                      <div
                        className="w-full rounded-t-lg progress-gradient transition-all duration-500 hover:opacity-80"
                        style={{ height: `${(day.problems / maxProblems) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Interactions */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-6">
                <Brain className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">AI Interactions</h2>
              </div>

              <div className="space-y-4">
                <div className="text-center py-6">
                  <div className="text-4xl font-bold text-primary mb-2">23</div>
                  <p className="text-sm text-muted-foreground">Total AI Conversations</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Concepts Clarified</span>
                    <span className="font-medium">18</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Redirects to Basics</span>
                    <span className="font-medium">5</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Understanding Rate</span>
                    <span className="font-medium text-green-500">78%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Weak Topics */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-6">
                <Target className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">Areas to Improve</h2>
              </div>

              <div className="space-y-4">
                {weakTopics.map((topic, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{topic.name}</span>
                      <span className="text-muted-foreground">{topic.score}/{topic.total}</span>
                    </div>
                    <Progress 
                      value={(topic.score / topic.total) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}

                <Link to="/domains">
                  <Button variant="outline" className="w-full mt-4 gap-2">
                    Practice Weak Areas
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Recent Problems
                </h2>
                <Link to="/domains" className="text-sm text-primary hover:underline">
                  View all
                </Link>
              </div>

              <div className="space-y-3">
                {recentProblems.map((problem, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      problem.completed ? "bg-green-100 dark:bg-green-900/30" : "bg-muted"
                    }`}>
                      {problem.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{problem.title}</p>
                      <p className="text-xs text-muted-foreground">{problem.domain}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      problem.difficulty === "Easy" 
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : problem.difficulty === "Medium"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      {problem.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
