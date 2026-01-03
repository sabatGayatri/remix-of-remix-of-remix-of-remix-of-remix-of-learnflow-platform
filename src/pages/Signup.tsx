import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Mail, Lock, User, ArrowRight, BookOpen, Users } from "lucide-react";
import { useAuth, UserRole } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("learner");
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters",
        variant: "destructive"
      });
      return;
    }

    const result = signup(name, email, password, role);
    
    if (result.success) {
      toast({
        title: "Account created!",
        description: `Welcome to LearnSolve as ${role}`,
      });
      navigate(role === "instructor" ? "/instructor" : "/domains");
    } else {
      toast({
        title: "Signup failed",
        description: result.error,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">LearnSolve</span>
        </Link>

        <h1 className="text-2xl font-bold mb-2">Create an account</h1>
        <p className="text-muted-foreground mb-8">
          Start your learning journey with LearnSolve
        </p>

        {/* Role Selection */}
        <div className="mb-6">
          <Label className="mb-3 block">I want to join as</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("learner")}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                role === "learner"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-muted-foreground"
              }`}
            >
              <BookOpen className={`w-5 h-5 ${role === "learner" ? "text-primary" : "text-muted-foreground"}`} />
              <div className="text-left">
                <p className={`font-medium ${role === "learner" ? "text-primary" : "text-foreground"}`}>Learner</p>
                <p className="text-xs text-muted-foreground">Learn & Practice</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setRole("instructor")}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                role === "instructor"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-muted-foreground"
              }`}
            >
              <Users className={`w-5 h-5 ${role === "instructor" ? "text-primary" : "text-muted-foreground"}`} />
              <div className="text-left">
                <p className={`font-medium ${role === "instructor" ? "text-primary" : "text-foreground"}`}>Instructor</p>
                <p className="text-xs text-muted-foreground">Teach & Manage</p>
              </div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                className="pl-10 h-12"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="pl-10 h-12"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10 h-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Must be at least 8 characters
            </p>
          </div>

          <Button type="submit" variant="default" size="lg" className="w-full group">
            Create {role === "instructor" ? "Instructor" : "Learner"} Account
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>

        <p className="text-center text-xs text-muted-foreground mt-4">
          By creating an account, you agree to our{" "}
          <Link to="#" className="text-primary hover:underline">Terms of Service</Link>
          {" "}and{" "}
          <Link to="#" className="text-primary hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
