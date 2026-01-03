import { useState } from "react";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import InstructorSidebar from "@/components/instructor/InstructorSidebar";
import DashboardTab from "@/components/instructor/DashboardTab";
import ContentManagementTab from "@/components/instructor/ContentManagementTab";
import QuestionLinkingTab from "@/components/instructor/QuestionLinkingTab";
import DoubtManagementTab from "@/components/instructor/DoubtManagementTab";
import AICollaborationTab from "@/components/instructor/AICollaborationTab";
import AnalyticsTab from "@/components/instructor/AnalyticsTab";

const tabTitles: Record<string, string> = {
  dashboard: "Dashboard",
  content: "Content Management",
  linking: "Question Linking",
  doubts: "Doubt Management",
  ai: "AI Collaboration",
  analytics: "Analytics",
};

const tabDescriptions: Record<string, string> = {
  dashboard: "Overview of your teaching activity",
  content: "Upload and manage video content",
  linking: "Connect videos to curriculum",
  doubts: "Respond to student questions",
  ai: "Review AI explanations",
  analytics: "Track student progress",
};

const Instructor = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setMobileOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab instructorName="Dr. Sharma" />;
      case "content":
        return <ContentManagementTab />;
      case "linking":
        return <QuestionLinkingTab />;
      case "doubts":
        return <DoubtManagementTab />;
      case "ai":
        return <AICollaborationTab />;
      case "analytics":
        return <AnalyticsTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <InstructorSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="flex h-14 items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-3">
              {/* Mobile Menu */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-60">
                  <InstructorSidebar
                    activeTab={activeTab}
                    setActiveTab={handleTabChange}
                  />
                </SheetContent>
              </Sheet>

              <div>
                <h1 className="text-lg font-semibold">{tabTitles[activeTab]}</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {tabDescriptions[activeTab]}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative h-9 w-9">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-medium flex items-center justify-center">
                  3
                </span>
              </Button>
              <div className="hidden sm:flex items-center gap-2.5 pl-2.5 ml-1 border-l border-border">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground text-xs font-medium">
                    DS
                  </span>
                </div>
                <span className="text-sm font-medium">Dr. Sharma</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Instructor;
