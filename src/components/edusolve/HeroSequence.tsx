import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, Sparkles, Rocket, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollFrames } from "./useScrollFrames";

const STAGES = [
  { id: "01", label: "Explore", title: "Choose your universe", desc: "Browse domains like DSA, Web Dev, ML — pick the world you want to master." },
  { id: "02", label: "Learn", title: "Watch with intent", desc: "Cinematic videos with AI-generated transcripts, notes and timestamps." },
  { id: "03", label: "Practice", title: "Solve & quiz", desc: "Timed MCQs, instant feedback, and AI tutor whenever you're stuck." },
  { id: "04", label: "Analyze", title: "See your trajectory", desc: "Activity calendars and progress charts that update in real time." },
];

interface HeroProps {
  onStart: () => void;
  onUpload: () => void;
}

const HeroSequence = ({ onStart, onUpload }: HeroProps) => {
  const { canvasRef, containerRef, loadProgress, ready, usingFallback, scrollProgress } =
    useScrollFrames({ totalScrollHeight: 4 });

  const stageIndex = Math.min(STAGES.length - 1, Math.floor(scrollProgress * STAGES.length));
  const activeStage = STAGES[stageIndex];

  const goToStage = (i: number) => {
    const container = containerRef.current;
    if (!container) return;
    const target = container.offsetTop + (container.offsetHeight - window.innerHeight) * (i / (STAGES.length - 1));
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  const showLoader = !ready || (!usingFallback && loadProgress < 0.05);

  return (
    <>
      {/* Loading overlay */}
      <AnimatePresence>
        {showLoader && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-blue))] flex items-center justify-center animate-pulse-glow">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">EDUSOLVE</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              EDUSOLVE AI is preparing your learning experience…
            </p>
            <div className="w-64 h-1 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-cyan))]"
                style={{ width: `${Math.max(8, loadProgress * 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section
        ref={containerRef}
        className="relative w-full"
        style={{ height: `400vh` }}
      >
        {/* Sticky stage */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Canvas background */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ background: "hsl(var(--background))" }}
          />
          {/* Vignette */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(var(--background))_95%)]" />
          {/* Subtle grid */}
          <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

          {/* Left: text overlay */}
          <div className="absolute inset-0 flex items-center">
            <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-12 gap-6">
              <motion.div
                key={`text-${stageIndex}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="col-span-12 lg:col-span-6"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 backdrop-blur px-3 py-1 text-xs text-muted-foreground mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--neon-cyan))] animate-pulse" />
                  AI-powered learning, in real time
                </div>
                <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold leading-[0.95] tracking-tight mb-4">
                  EDU<span className="text-neon">SOLVE</span>
                </h1>
                <p className="text-xl lg:text-2xl text-foreground/80 mb-3">
                  Learn smarter with AI.
                </p>
                <p className="text-base lg:text-lg text-muted-foreground max-w-lg mb-8">
                  A video-based learning platform where learners watch, solve and track progress —
                  while instructors create and manage intelligent content.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    size="lg"
                    onClick={onStart}
                    className="bg-gradient-to-r from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-blue))] text-white hover:opacity-90 shadow-lg shadow-[hsl(var(--neon-purple))]/30 border-0"
                  >
                    <Rocket className="w-4 h-4" /> Start Learning
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={onUpload}
                    className="border-border/60 bg-background/40 backdrop-blur"
                  >
                    <Upload className="w-4 h-4" /> Upload Lecture
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right: stage navigator */}
          <div className="absolute right-4 lg:right-12 top-1/2 -translate-y-1/2 z-10">
            <div className="glass-panel rounded-2xl p-4 lg:p-5 w-[260px] hidden md:block">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Learning flow</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => goToStage(Math.max(0, stageIndex - 1))}
                    className="w-7 h-7 rounded-md border border-border/60 hover:border-[hsl(var(--neon-purple))] flex items-center justify-center transition-colors"
                    aria-label="Previous stage"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => goToStage(Math.min(STAGES.length - 1, stageIndex + 1))}
                    className="w-7 h-7 rounded-md border border-border/60 hover:border-[hsl(var(--neon-purple))] flex items-center justify-center transition-colors"
                    aria-label="Next stage"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <ul className="space-y-2">
                {STAGES.map((s, i) => {
                  const active = i === stageIndex;
                  return (
                    <li key={s.id}>
                      <button
                        onClick={() => goToStage(i)}
                        className={`w-full text-left flex items-baseline gap-3 py-2 px-2 rounded-lg transition-all ${active ? "bg-[hsl(var(--neon-purple)/0.1)]" : "hover:bg-muted/50"}`}
                      >
                        <span className={`text-xs font-mono ${active ? "text-[hsl(var(--neon-cyan))]" : "text-muted-foreground"}`}>
                          {s.id}
                        </span>
                        <span className={`text-2xl font-semibold transition-all ${active ? "stage-active" : "stage-inactive"}`}>
                          {s.label}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-4 pt-4 border-t border-border/60">
                <p className="text-xs font-medium text-foreground mb-1">{activeStage.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{activeStage.desc}</p>
              </div>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground flex flex-col items-center gap-2">
            <span className="tracking-[0.3em] uppercase">Scroll</span>
            <div className="w-px h-10 bg-gradient-to-b from-[hsl(var(--neon-purple))] to-transparent" />
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSequence;
