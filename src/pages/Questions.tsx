import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Clock, CheckCircle2, Play } from "lucide-react";
import { useState } from "react";
import { getTopic } from "@/data/curriculum";

const difficultyColors: Record<string, string> = {
  Easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const Questions = () => {
  const { domainId, difficultyId, topicId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  
  const topic = getTopic(domainId || "", difficultyId || "", topicId || "");
  const topicName = topic?.name || "Unknown Topic";
  const questions = topic?.questions || [];

  const filteredQuestions = questions.filter((q) =>
    q.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <Link
            to={`/domains/${domainId}/${difficultyId}/topics`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Topics
          </Link>

          {/* Header */}
          <div className="max-w-2xl mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold capitalize">
                {difficultyId}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{topicName}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {topicName} <span className="text-primary">Questions</span>
            </h1>
            <p className="text-muted-foreground">
              {filteredQuestions.length} problems available. Watch video solutions and master each concept.
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-md mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          {/* Questions List */}
          <div className="space-y-3 max-w-4xl">
            {filteredQuestions.map((question, index) => (
              <Link
                key={question.id}
                to={`/solve/${question.id}`}
                className="question-card flex items-center gap-4"
              >
                {/* Status indicator */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  question.completed 
                    ? "bg-green-100 dark:bg-green-900/30" 
                    : "bg-muted"
                }`}>
                  {question.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <span className="text-sm font-medium text-muted-foreground">{index + 1}</span>
                  )}
                </div>

                {/* Question info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate group-hover:text-primary transition-colors">
                    {question.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge variant="secondary" className={difficultyColors[question.difficulty]}>
                      {question.difficulty}
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {question.time}
                    </span>
                  </div>
                </div>

                {/* Video indicator */}
                {question.hasVideo && (
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                    <Play className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
                  </div>
                )}
              </Link>
            ))}
          </div>

          {filteredQuestions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No questions found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Questions;
