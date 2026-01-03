import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Code2, Calculator, Brain, ArrowRight } from "lucide-react";
import { curriculumData } from "@/data/curriculum";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  maths: Calculator,
  aptitude: Brain,
  dsa: Code2,
};

const colorMap: Record<string, string> = {
  maths: "from-blue-500 to-indigo-600",
  aptitude: "from-purple-500 to-pink-600",
  dsa: "from-green-500 to-emerald-600",
};

const descriptionMap: Record<string, string> = {
  maths: "Master number systems, algebra, calculus, and mathematical reasoning with step-by-step solutions.",
  aptitude: "Ace quantitative aptitude, logical reasoning, and verbal ability for competitive exams.",
  dsa: "Learn arrays, trees, graphs, dynamic programming, and more with video-guided problem solving.",
};

const domains = curriculumData.map((domain) => {
  const totalTopics = domain.difficulties.reduce((acc, d) => acc + d.topics.length, 0);
  const totalProblems = domain.difficulties.reduce(
    (acc, d) => acc + d.topics.reduce((tacc, t) => tacc + t.questions.length, 0),
    0
  );
  return {
    id: domain.id,
    name: domain.name,
    shortName: domain.shortName,
    icon: iconMap[domain.id] || Code2,
    description: descriptionMap[domain.id] || "",
    topics: totalTopics,
    problems: totalProblems,
    color: colorMap[domain.id] || "from-blue-500 to-indigo-600",
  };
});

const Domains = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Choose Your Path
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-4">
              Select a <span className="text-primary">Domain</span> to Begin
            </h1>
            <p className="text-muted-foreground">
              Pick the area you want to master. Each domain contains curated problems 
              with video solutions and AI assistance.
            </p>
          </div>

          {/* Domain Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {domains.map((domain) => (
              <Link
                key={domain.id}
                to={`/domains/${domain.id}/difficulty`}
                className="domain-card group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${domain.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <domain.icon className="w-8 h-8 text-white" />
                </div>

                <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {domain.name}
                </h2>
                <p className="text-muted-foreground text-sm mb-6">
                  {domain.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex gap-6">
                    <div>
                      <div className="text-lg font-bold text-primary">{domain.topics}</div>
                      <div className="text-xs text-muted-foreground">Topics</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-primary">{domain.problems}</div>
                      <div className="text-xs text-muted-foreground">Problems</div>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Domains;
