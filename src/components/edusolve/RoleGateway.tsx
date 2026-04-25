import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Presentation, ArrowRight, ArrowLeft, Sparkles, Radar, BookOpen, BarChart3 } from "lucide-react";
import { UserRole } from "@/hooks/useAuth";

type Mode = "select" | "detail";

interface RoleGatewayProps {
  initialRole?: UserRole | null;
}

const ROLE_META: Record<UserRole, { icon: typeof GraduationCap; title: string; desc: string; subtitle: string }> = {
  learner: {
    icon: GraduationCap,
    title: "Learner",
    desc: "Watch lectures, solve problems and track your trajectory with AI assistance.",
    subtitle: "Start your learning journey",
  },
  instructor: {
    icon: Presentation,
    title: "Instructor",
    desc: "Upload lectures, link them to questions and see real-time student engagement.",
    subtitle: "Create and manage learning content",
  },
};

const ROLE_FEATURES: Record<UserRole, { icon: typeof Sparkles; label: string }[]> = {
  learner: [
    { icon: BookOpen, label: "Adaptive video lessons" },
    { icon: Sparkles, label: "AI-powered doubt support" },
    { icon: Radar, label: "Realtime progress signals" },
  ],
  instructor: [
    { icon: Presentation, label: "Content publishing workflow" },
    { icon: BarChart3, label: "Live learner analytics" },
    { icon: Sparkles, label: "AI-assisted teaching tools" },
  ],
};

const RoleGateway = ({ initialRole = null }: RoleGatewayProps) => {
  const [selected, setSelected] = useState<UserRole | null>(initialRole);
  const [mode, setMode] = useState<Mode>(initialRole ? "detail" : "select");

  const choose = (role: UserRole) => {
    setSelected(role);
    setTimeout(() => setMode("detail"), 350);
  };

  const back = () => {
    setMode("select");
    setTimeout(() => setSelected(null), 250);
  };

  return (
    <section id="role-gateway" className="relative py-32 overflow-hidden">
      {/* Dim continuity background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[hsl(var(--neon-purple)/0.08)] blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {mode === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="text-center mb-14">
                <p className="text-xs uppercase tracking-[0.3em] text-[hsl(var(--neon-cyan))] mb-4">Step in</p>
                <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                  How do you want to use <span className="text-neon">EDUSOLVE</span>?
                </h2>
                <p className="text-muted-foreground">Pick your role to enter the right doorway.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {(Object.keys(ROLE_META) as UserRole[]).map((role, i) => {
                  const meta = ROLE_META[role];
                  const Icon = meta.icon;
                  const isSelected = selected === role;
                  const isOther = selected && selected !== role;
                  return (
                    <motion.button
                      key={role}
                      onClick={() => choose(role)}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{
                        opacity: isOther ? 0 : 1,
                        y: 0,
                        scale: isSelected ? 1.04 : 1,
                      }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      whileHover={!selected ? { y: -6, scale: 1.02 } : undefined}
                      className="group relative text-left p-8 rounded-3xl glass-panel hover:border-[hsl(var(--neon-purple))] transition-colors"
                    >
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[hsl(var(--neon-purple)/0.15)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-blue))] flex items-center justify-center mb-6 group-hover:glow-purple transition-shadow">
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{meta.title}</h3>
                        <p className="text-muted-foreground mb-6">{meta.desc}</p>
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--neon-cyan))]">
                          Continue as {meta.title.toLowerCase()}
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {mode === "detail" && selected && (
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto"
            >
              <button
                onClick={back}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Change role
              </button>

              <div className="glass-panel rounded-3xl p-8 lg:p-10">
                <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-blue))] flex items-center justify-center">
                        {(() => {
                          const Icon = ROLE_META[selected].icon;
                          return <Icon className="w-5 h-5 text-white" />;
                        })()}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{ROLE_META[selected].title}</h3>
                        <p className="text-xs text-muted-foreground">{ROLE_META[selected].subtitle}</p>
                      </div>
                    </div>

                    <p className="text-lg leading-8 text-muted-foreground mb-8 max-w-xl">
                      {selected === "learner"
                        ? "A guided path through video lessons, AI support, challenge-solving, and measurable mastery."
                        : "A command center for publishing lessons, monitoring student activity, and steering outcomes in real time."}
                    </p>

                    <div className="grid sm:grid-cols-3 gap-3">
                      {ROLE_FEATURES[selected].map(({ icon: Icon, label }) => (
                        <div key={label} className="rounded-2xl border border-border/60 bg-background/30 p-4">
                          <Icon className="w-5 h-5 mb-3 text-[hsl(var(--neon-cyan))]" />
                          <p className="text-sm text-foreground/90">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-border/60 bg-background/35 p-6">
                    <p className="text-xs uppercase tracking-[0.24em] text-[hsl(var(--neon-cyan))] mb-4">Experience preview</p>
                    <div className="space-y-4">
                      <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                        <p className="text-sm font-medium mb-1">
                          {selected === "learner" ? "Learning flow" : "Teaching flow"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selected === "learner"
                            ? "Discover a topic, watch the concept, solve a related question, and review progress instantly."
                            : "Upload a lesson, link assessments, watch engagement live, and refine the next release."}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                        <p className="text-sm font-medium mb-1">Current status</p>
                        <p className="text-sm text-muted-foreground">Authentication is temporarily disabled, so this landing page is now presentation-only.</p>
                      </div>
                    </div>
                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--neon-cyan))]">
                      Explore the EDUSOLVE experience
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default RoleGateway;
