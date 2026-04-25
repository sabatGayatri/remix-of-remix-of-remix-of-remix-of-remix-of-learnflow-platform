import { motion } from "framer-motion";
import {
  Compass, PlayCircle, ListChecks, BarChart3, MessageCircle,
  UploadCloud, Link2, Inbox, LineChart, Radio, Sparkles, Zap,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

const FeatureCard = ({
  icon: Icon, title, desc, accent = "purple",
}: { icon: typeof Compass; title: string; desc: string; accent?: "purple" | "blue" | "cyan" }) => {
  const accentVar = accent === "purple" ? "--neon-purple" : accent === "blue" ? "--neon-blue" : "--neon-cyan";
  return (
    <motion.div {...fadeUp} className="group relative p-6 rounded-2xl glass-panel hover:-translate-y-1 transition-transform">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
        style={{ background: `hsl(var(${accentVar}) / 0.15)`, color: `hsl(var(${accentVar}))` }}
      >
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-lg font-semibold mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </motion.div>
  );
};

const SectionHeader = ({ tag, title, desc }: { tag: string; title: React.ReactNode; desc: string }) => (
  <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
    <p className="text-xs uppercase tracking-[0.3em] text-[hsl(var(--neon-cyan))] mb-3">{tag}</p>
    <h2 className="text-4xl lg:text-5xl font-bold mb-4">{title}</h2>
    <p className="text-muted-foreground text-lg">{desc}</p>
  </motion.div>
);

export const LearnerSection = () => (
  <section className="relative py-28">
    <div className="max-w-7xl mx-auto px-6">
      <SectionHeader
        tag="For learners"
        title={<>The full <span className="text-neon">learning loop</span></>}
        desc="Curriculum that unfolds — from picking a domain to seeing your trajectory chart change."
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        <FeatureCard icon={Compass} accent="purple" title="Curriculum navigation" desc="Domain → Difficulty → Topic → Question. Always know where you are." />
        <FeatureCard icon={PlayCircle} accent="blue" title="Video learning" desc="Player with progress tracking, AI notes and summaries side-by-side." />
        <FeatureCard icon={ListChecks} accent="cyan" title="Timed quizzes" desc="MCQs with instant feedback — green pulse for right, gentle shake for wrong." />
        <FeatureCard icon={BarChart3} accent="purple" title="Personal dashboard" desc="Activity calendar plus pie charts for progress and average score." />
        <FeatureCard icon={MessageCircle} accent="blue" title="AI tutor" desc="Stuck on a step? Ask EDUSOLVE AI in chat and get a guided answer." />
        <FeatureCard icon={Sparkles} accent="cyan" title="AI summaries" desc="Long videos collapsed into key takeaways and timestamped highlights." />
      </div>
    </div>
  </section>
);

export const InstructorSection = () => (
  <section className="relative py-28">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(var(--neon-blue)/0.04)] to-transparent pointer-events-none" />
    <div className="relative max-w-7xl mx-auto px-6">
      <SectionHeader
        tag="For instructors"
        title={<>Teach with <span className="text-neon">intelligence</span></>}
        desc="A console built for content creators — upload, link, respond, analyze."
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        <FeatureCard icon={UploadCloud} accent="purple" title="Upload videos" desc="Tag with domain, topic, difficulty. Stored securely on EDUSOLVE Cloud." />
        <FeatureCard icon={Link2} accent="blue" title="Link to questions" desc="Bind videos to curriculum nodes so learners discover them naturally." />
        <FeatureCard icon={Inbox} accent="cyan" title="Doubt management" desc="A chat-style inbox for student questions — respond fast, in context." />
        <FeatureCard icon={LineChart} accent="purple" title="Live analytics" desc="See engagement and progress per video, in real time." />
      </div>
    </div>
  </section>
);

export const RealtimeSection = () => (
  <section className="relative py-28">
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
        <motion.div {...fadeUp}>
          <p className="text-xs uppercase tracking-[0.3em] text-[hsl(var(--neon-cyan))] mb-3">Realtime</p>
          <h2 className="text-4xl lg:text-5xl font-bold mb-5">
            Updates that <span className="text-neon">arrive instantly</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-6">
            New videos appear for learners the moment they're uploaded. Progress flows live to instructor
            dashboards. No refresh, no delay.
          </p>
          <ul className="space-y-3">
            {[
              { icon: Radio, text: "New videos surface in topic lists immediately" },
              { icon: Zap, text: "Progress and quiz scores stream into dashboards live" },
              { icon: LineChart, text: "Instructors see engagement in real time" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <span className="mt-0.5 w-8 h-8 rounded-lg bg-[hsl(var(--neon-purple)/0.15)] text-[hsl(var(--neon-purple))] flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </span>
                <span className="text-foreground/90">{text}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div {...fadeUp} className="relative">
          <div className="glass-panel rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--neon-purple)/0.1)] to-[hsl(var(--neon-blue)/0.1)] pointer-events-none" />
            <div className="relative space-y-3">
              {["DSA · Two Sum walkthrough · just uploaded", "Quiz · Arrays · 8/10 by ada@…", "Web Dev · Hooks deep-dive · just uploaded", "Progress · Trees module 76% complete"].map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/50"
                >
                  <span className="w-2 h-2 rounded-full bg-[hsl(var(--neon-cyan))] animate-pulse" />
                  <span className="text-sm">{line}</span>
                  <span className="ml-auto text-xs text-muted-foreground">live</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);
