import { Play, MessageCircle, Trophy } from "lucide-react";

const features = [
  {
    icon: Play,
    title: "Video Solutions",
    description: "Watch step-by-step video explanations from expert instructors. Jump to any step with interactive timestamps.",
  },
  {
    icon: MessageCircle,
    title: "AI Doubt Resolution",
    description: "Didn't understand something? Our AI assistant explains concepts in simpler terms using the video context.",
  },
  {
    icon: Trophy,
    title: "Track Progress",
    description: "Complete quizzes, earn edCoins, and track your learning journey with detailed analytics.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            How LearnSolve Works
          </h2>
          <p className="text-muted-foreground">
            A focused learning experience designed to help you master problem-solving skills.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-card border border-border card-hover"
            >
              <div className="icon-wrapper mb-5">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;