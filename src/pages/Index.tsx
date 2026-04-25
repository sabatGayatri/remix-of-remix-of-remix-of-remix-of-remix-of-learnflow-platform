import { useEffect } from "react";
import HeroSequence from "@/components/edusolve/HeroSequence";
import RoleGateway from "@/components/edusolve/RoleGateway";
import { LearnerSection, InstructorSection, RealtimeSection } from "@/components/edusolve/Sections";
import { EdusolveNavbar, EdusolveFooter } from "@/components/edusolve/Chrome";
import { UserRole } from "@/hooks/useAuth";
import { useState } from "react";

const Index = () => {
  const [preselected, setPreselected] = useState<UserRole | null>(null);

  // SEO basics
  useEffect(() => {
    document.title = "EDUSOLVE — Learn Smarter with AI";
    const meta = document.querySelector('meta[name="description"]') ?? document.createElement("meta");
    meta.setAttribute("name", "description");
    meta.setAttribute("content", "EDUSOLVE is a cinematic AI-powered learning platform with real-time videos, quizzes and analytics for learners and instructors.");
    if (!meta.parentElement) document.head.appendChild(meta);
  }, []);

  const scrollToGateway = (role: UserRole) => {
    setPreselected(role);
    const el = document.getElementById("role-gateway");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <EdusolveNavbar />
      <main>
        <HeroSequence
          onStart={() => scrollToGateway("learner")}
          onUpload={() => scrollToGateway("instructor")}
        />
        <RoleGateway initialRole={preselected} key={preselected ?? "none"} />
        <LearnerSection />
        <InstructorSection />
        <RealtimeSection />
      </main>
      <EdusolveFooter />
    </div>
  );
};

export default Index;
