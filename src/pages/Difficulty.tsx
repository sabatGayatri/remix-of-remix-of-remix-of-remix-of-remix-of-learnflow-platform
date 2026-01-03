import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Gauge, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDomain } from "@/data/curriculum";

const difficultyMeta: Record<string, { description: string; estimatedTime: string; color: string; bgColor: string; borderColor: string }> = {
  beginner: {
    description: "Start here if you're new to this domain. Learn fundamentals and build a strong foundation.",
    estimatedTime: "2-4 weeks",
    color: "from-green-400 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-green-200 dark:border-green-800",
  },
  intermediate: {
    description: "For those with basics covered. Tackle moderately challenging problems and patterns.",
    estimatedTime: "4-8 weeks",
    color: "from-yellow-400 to-orange-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
    borderColor: "border-yellow-200 dark:border-yellow-800",
  },
  advanced: {
    description: "Master complex concepts and prepare for competitive programming or tough interviews.",
    estimatedTime: "6-12 weeks",
    color: "from-red-400 to-rose-500",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-red-200 dark:border-red-800",
  },
};

const Difficulty = () => {
  const { domainId } = useParams();
  const domain = getDomain(domainId || "");
  const domainName = domain?.name || "Unknown Domain";

  const difficulties = domain?.difficulties.map((d) => {
    const totalProblems = d.topics.reduce((acc, t) => acc + t.questions.length, 0);
    const meta = difficultyMeta[d.id] || difficultyMeta.beginner;
    return {
      id: d.id,
      name: d.name,
      problems: totalProblems,
      ...meta,
    };
  }) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <Link
            to="/domains"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Domains
          </Link>

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              {domainName}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-4">
              Choose Your <span className="text-primary">Difficulty</span>
            </h1>
            <p className="text-muted-foreground">
              Select a difficulty level based on your current knowledge and learning goals.
            </p>
          </div>

          {/* Difficulty Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {difficulties.map((diff) => (
              <Link
                key={diff.id}
                to={`/domains/${domainId}/${diff.id}/topics`}
                className={`relative overflow-hidden rounded-2xl p-6 ${diff.bgColor} border ${diff.borderColor} transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group`}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${diff.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Gauge className="w-7 h-7 text-white" />
                </div>

                <h2 className="text-xl font-bold mb-2">{diff.name}</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  {diff.description}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Problems</span>
                    <span className="font-semibold">{diff.problems}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Est. Time</span>
                    <span className="font-semibold">{diff.estimatedTime}</span>
                  </div>
                </div>

                <Button variant="default" className="w-full group/btn">
                  Start Learning
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Difficulty;
