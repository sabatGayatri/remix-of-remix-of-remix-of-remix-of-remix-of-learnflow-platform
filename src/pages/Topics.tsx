import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { getDomain, getTopicsForDifficulty } from "@/data/curriculum";

const Topics = () => {
  const { domainId, difficultyId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  
  const domain = getDomain(domainId || "");
  const domainName = domain?.name || "Unknown Domain";
  const topics = getTopicsForDifficulty(domainId || "", difficultyId || "");
  
  const filteredTopics = topics.filter((topic) =>
    topic.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <Link
            to={`/domains/${domainId}/difficulty`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Difficulty
          </Link>

          {/* Header */}
          <div className="max-w-2xl mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold capitalize">
                {difficultyId}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {domainName} <span className="text-primary">Topics</span>
            </h1>
            <p className="text-muted-foreground">
              Select a topic to view problems and start solving with video guidance.
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-md mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          {/* Topics Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTopics.map((topic) => {
              const completed = topic.questions.filter((q) => q.completed).length;
              const total = topic.questions.length;
              const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
              
              return (
                <Link
                  key={topic.id}
                  to={`/domains/${domainId}/${difficultyId}/${topic.id}/questions`}
                  className="group p-5 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {topic.name}
                    </h3>
                    {progress === 100 && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>{completed}/{total} completed</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full progress-gradient rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {total} problems
                    </span>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {filteredTopics.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No topics found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Topics;
