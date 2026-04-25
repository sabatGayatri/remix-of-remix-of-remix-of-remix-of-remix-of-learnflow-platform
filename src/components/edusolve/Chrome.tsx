import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Moon, Sun, Github, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

export const EdusolveNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/70 backdrop-blur-xl border-b border-border/60" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-blue))] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold tracking-tight">EDUSOLVE</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm">
          <Link to="/domains" className="text-muted-foreground hover:text-foreground transition-colors">Domains</Link>
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
          <Link to="/instructor" className="text-muted-foreground hover:text-foreground transition-colors">Instructor</Link>
          <Link to="/ai-help" className="text-muted-foreground hover:text-foreground transition-colors">AI Help</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme" className="h-9 w-9">
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <a href="#role-gateway">
            <Button size="sm" className="bg-gradient-to-r from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-blue))] text-white border-0">
              Get started
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
};

export const EdusolveFooter = () => (
  <footer className="relative border-t border-border/60 bg-background">
    <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">
      <div className="md:col-span-2">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-blue))] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold tracking-tight">EDUSOLVE</span>
        </div>
        <p className="text-sm text-muted-foreground max-w-sm">
          A cinematic, AI-powered learning platform connecting learners and instructors through real-time content.
        </p>
      </div>
      <div>
        <p className="text-sm font-semibold mb-3">Product</p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/domains" className="hover:text-foreground">Domains</Link></li>
          <li><Link to="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
          <li><Link to="/ai-help" className="hover:text-foreground">AI Help</Link></li>
        </ul>
      </div>
      <div>
        <p className="text-sm font-semibold mb-3">Company</p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><a href="#" className="hover:text-foreground">About</a></li>
          <li><a href="#" className="hover:text-foreground">Contact</a></li>
          <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
          <li><a href="#" className="hover:text-foreground">Terms</a></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-border/60">
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} EDUSOLVE. All rights reserved.</p>
        <div className="flex items-center gap-3 text-muted-foreground">
          <a href="#" aria-label="Twitter" className="hover:text-foreground"><Twitter className="w-4 h-4" /></a>
          <a href="#" aria-label="GitHub" className="hover:text-foreground"><Github className="w-4 h-4" /></a>
          <a href="#" aria-label="LinkedIn" className="hover:text-foreground"><Linkedin className="w-4 h-4" /></a>
        </div>
      </div>
    </div>
  </footer>
);
