import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Presentation, ArrowRight, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, UserRole } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

type Mode = "select" | "auth";
type AuthTab = "login" | "signup";

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

const RoleGateway = ({ initialRole = null }: RoleGatewayProps) => {
  const [selected, setSelected] = useState<UserRole | null>(initialRole);
  const [mode, setMode] = useState<Mode>(initialRole ? "auth" : "select");
  const [tab, setTab] = useState<AuthTab>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, signup } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const choose = (role: UserRole) => {
    setSelected(role);
    setTimeout(() => setMode("auth"), 350);
  };

  const back = () => {
    setMode("select");
    setTimeout(() => setSelected(null), 250);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    if (!email || !password || (tab === "signup" && !name)) {
      toast({ title: "Missing info", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    if (tab === "signup" && password.length < 8) {
      toast({ title: "Weak password", description: "Use at least 8 characters", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const res = tab === "login"
      ? await login(email, password, selected)
      : await signup(name, email, password, selected);
    setSubmitting(false);
    if (res.success) {
      toast({ title: tab === "login" ? "Welcome back" : "Account created", description: `Signed in as ${selected}` });
      navigate(selected === "instructor" ? "/instructor" : "/domains");
    } else {
      toast({ title: "Authentication failed", description: res.error, variant: "destructive" });
    }
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

          {mode === "auth" && selected && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-md mx-auto"
            >
              <button
                onClick={back}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Change role
              </button>

              <div className="glass-panel rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-blue))] flex items-center justify-center">
                    {(() => { const Icon = ROLE_META[selected].icon; return <Icon className="w-5 h-5 text-white" />; })()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{ROLE_META[selected].title}</h3>
                    <p className="text-xs text-muted-foreground">{ROLE_META[selected].subtitle}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1 p-1 bg-muted rounded-lg mb-6">
                  {(["login", "signup"] as AuthTab[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTab(t)}
                      className={`py-2 text-sm font-medium rounded-md transition-all ${
                        tab === t ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {t === "login" ? "Sign In" : "Create Account"}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <AnimatePresence>
                    {tab === "signup" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 overflow-hidden"
                      >
                        <Label htmlFor="rg-name">Full name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input id="rg-name" value={name} onChange={(e) => setName(e.target.value)} className="pl-10 h-11 bg-background/50" placeholder="Ada Lovelace" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-2">
                    <Label htmlFor="rg-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input id="rg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-11 bg-background/50" placeholder="you@example.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rg-pw">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input id="rg-pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 h-11 bg-background/50" placeholder="••••••••" />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-blue))] text-white hover:opacity-90 border-0"
                  >
                    {submitting
                      ? "Please wait…"
                      : tab === "login"
                        ? `Enter as ${ROLE_META[selected].title}`
                        : `Create ${ROLE_META[selected].title} account`}
                    {!submitting && <ArrowRight className="w-4 h-4" />}
                  </Button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default RoleGateway;
