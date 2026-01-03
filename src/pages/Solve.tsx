import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Volume2, 
  Maximize, 
  CheckCircle2, 
  XCircle, 
  MessageCircle,
  Clock,
  BookOpen
} from "lucide-react";

const timestamps = [
  { id: 1, time: "0:00", title: "Problem Understanding", description: "Breaking down the problem statement" },
  { id: 2, time: "2:30", title: "Approach Discussion", description: "Discussing brute force vs optimal" },
  { id: 3, time: "5:15", title: "Algorithm Design", description: "Designing the two-pointer approach" },
  { id: 4, time: "8:45", title: "Code Implementation", description: "Writing the solution step by step" },
  { id: 5, time: "12:00", title: "Dry Run", description: "Testing with example inputs" },
  { id: 6, time: "14:30", title: "Time & Space Analysis", description: "Complexity analysis" },
];

const Solve = () => {
  const { questionId } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTimestamp, setActiveTimestamp] = useState(1);
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 h-16 glass z-50 border-b border-border">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Link
            to="/domains/dsa/beginner/arrays/questions"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Questions
          </Link>

          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              Easy
            </Badge>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              15 min
            </span>
          </div>

          <Link to="/ai-help">
            <Button variant="outline" size="sm" className="gap-2">
              <MessageCircle className="w-4 h-4" />
              Ask AI
            </Button>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <main className="pt-20 pb-8 px-4">
        <div className="container mx-auto">
          {/* Question Title */}
          <h1 className="text-2xl font-bold mb-6">Two Sum</h1>

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Video Player - Left Side */}
            <div className="lg:col-span-3 space-y-4">
              <div className="video-container bg-gradient-to-br from-gray-900 to-gray-800 relative group">
                {/* Video placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                      isPlaying 
                        ? "bg-white/20 backdrop-blur-sm" 
                        : "bg-white shadow-lg hover:scale-110"
                    }`}
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-white" />
                    ) : (
                      <Play className="w-8 h-8 text-primary ml-1" />
                    )}
                  </button>
                </div>

                {/* Video controls */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setIsPlaying(!isPlaying)}>
                      {isPlaying ? (
                        <Pause className="w-5 h-5 text-white" />
                      ) : (
                        <Play className="w-5 h-5 text-white" />
                      )}
                    </button>
                    
                    {/* Progress bar */}
                    <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                      <div className="w-1/3 h-full bg-white rounded-full" />
                    </div>
                    
                    <span className="text-xs text-white">5:15 / 16:00</span>
                    
                    <Volume2 className="w-5 h-5 text-white" />
                    <Maximize className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Understanding Check */}
              {!showFeedback ? (
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <h3 className="font-semibold mb-2">Did you understand the solution?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    After watching, let us know if you need additional help.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 gap-2 border-green-200 text-green-600 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-950/30"
                      onClick={() => setShowFeedback(true)}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Yes, I understand
                    </Button>
                    <Link to="/ai-help" className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full gap-2 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/30"
                      >
                        <XCircle className="w-4 h-4" />
                        No, need help
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <h3 className="font-semibold text-green-700 dark:text-green-400">Great job!</h3>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-400 mb-4">
                    You've completed this problem. Ready for a quiz to test your understanding?
                  </p>
                  <div className="flex gap-3">
                    <Link to="/quiz/1" className="flex-1">
                      <Button variant="default" className="w-full">
                        Take Quiz
                      </Button>
                    </Link>
                    <Link to="/domains/dsa/beginner/arrays/questions" className="flex-1">
                      <Button variant="outline" className="w-full">
                        Next Problem
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Timestamps - Right Side */}
            <div className="lg:col-span-2">
              <div className="sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold">Video Steps</h2>
                </div>

                <div className="space-y-2">
                  {timestamps.map((ts) => (
                    <button
                      key={ts.id}
                      onClick={() => setActiveTimestamp(ts.id)}
                      className={`timestamp-item w-full text-left ${
                        activeTimestamp === ts.id ? "active" : ""
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activeTimestamp === ts.id 
                          ? "bg-primary text-white" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        <span className="text-xs font-medium">{ts.id}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm truncate">{ts.title}</span>
                          <span className="text-xs text-muted-foreground">{ts.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {ts.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Solve;
