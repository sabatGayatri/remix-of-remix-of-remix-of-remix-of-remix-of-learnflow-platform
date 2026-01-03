import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Domains from "./pages/Domains";
import Difficulty from "./pages/Difficulty";
import Topics from "./pages/Topics";
import Questions from "./pages/Questions";
import Solve from "./pages/Solve";
import AIHelp from "./pages/AIHelp";
import Dashboard from "./pages/Dashboard";
import Instructor from "./pages/Instructor";
import Quiz from "./pages/Quiz";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/domains" element={<Domains />} />
          <Route path="/domains/:domainId/difficulty" element={<Difficulty />} />
          <Route path="/domains/:domainId/:difficultyId/topics" element={<Topics />} />
          <Route path="/domains/:domainId/:difficultyId/:topicId/questions" element={<Questions />} />
          <Route path="/solve/:questionId" element={<Solve />} />
          <Route path="/ai-help" element={<AIHelp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/instructor" element={<Instructor />} />
          <Route path="/quiz/:quizId" element={<Quiz />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
