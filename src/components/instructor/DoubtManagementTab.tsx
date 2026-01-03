import { useState } from "react";
import {
  MessageCircle,
  CheckCircle2,
  Clock,
  Bot,
  Send,
  Filter,
  User,
  Video,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Doubt {
  id: number;
  student: string;
  studentId: string;
  question: string;
  video: string;
  timestamp: string;
  doubtText: string;
  aiExplanation: string;
  status: "pending" | "resolved";
  createdAt: string;
  instructorReply?: string;
}

interface DoubtManagementTabProps {
  doubts?: Doubt[];
  onReply?: (doubtId: number, reply: string) => void;
  onMarkResolved?: (doubtId: number) => void;
}

const DoubtManagementTab = ({
  doubts = [],
  onReply,
  onMarkResolved,
}: DoubtManagementTabProps) => {
  const [filter, setFilter] = useState<"all" | "pending" | "resolved">("all");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [expandedDoubts, setExpandedDoubts] = useState<number[]>([]);

  const filteredDoubts = doubts.filter((d) =>
    filter === "all" ? true : d.status === filter
  );

  const pendingCount = doubts.filter((d) => d.status === "pending").length;
  const resolvedCount = doubts.filter((d) => d.status === "resolved").length;

  const handleReply = (doubtId: number) => {
    onReply?.(doubtId, replyText);
    setReplyingTo(null);
    setReplyText("");
  };

  const toggleExpanded = (id: number) => {
    setExpandedDoubts((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="border-amber-200 dark:border-amber-800/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingCount}</p>
              <p className="text-sm text-muted-foreground">Pending Doubts</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-200 dark:border-green-800/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{resolvedCount}</p>
              <p className="text-sm text-muted-foreground">Resolved</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 dark:border-blue-800/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Bot className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {doubts.length > 0 ? Math.round((resolvedCount / doubts.length) * 100) : 0}%
              </p>
              <p className="text-sm text-muted-foreground">AI Assisted</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <Select
          value={filter}
          onValueChange={(val) => setFilter(val as typeof filter)}
        >
          <SelectTrigger className="w-36 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Doubts</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          {filteredDoubts.length} doubt{filteredDoubts.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Doubts List */}
      {filteredDoubts.length > 0 ? (
        <div className="space-y-3">
          {filteredDoubts.map((doubt) => (
            <Card key={doubt.id} className="overflow-hidden">
              <Collapsible
                open={expandedDoubts.includes(doubt.id)}
                onOpenChange={() => toggleExpanded(doubt.id)}
              >
                <CardHeader className="p-4 pb-3">
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{doubt.student}</span>
                            <span className="text-xs text-muted-foreground">
                              {doubt.studentId}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                            {doubt.doubtText}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge
                          variant="secondary"
                          className={
                            doubt.status === "pending"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                              : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          }
                        >
                          {doubt.status === "pending" ? "Pending" : "Resolved"}
                        </Badge>
                        <span className="text-xs text-muted-foreground hidden sm:inline">
                          {doubt.createdAt}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-muted-foreground transition-transform ${
                            expandedDoubts.includes(doubt.id) ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </div>
                  </CollapsibleTrigger>
                </CardHeader>

                <CollapsibleContent>
                  <CardContent className="pt-0 px-4 pb-4 space-y-4">
                    {/* Context */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Video className="w-4 h-4" />
                        {doubt.video}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {doubt.timestamp}
                      </span>
                    </div>

                    {/* Student's Question */}
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <p className="text-xs font-medium text-muted-foreground mb-1.5">
                        Student's Doubt
                      </p>
                      <p className="text-sm">{doubt.doubtText}</p>
                    </div>

                    {/* AI Explanation */}
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-medium text-blue-700 dark:text-blue-400">
                          AI (Gemini) Explanation
                        </span>
                      </div>
                      <p className="text-sm text-blue-900 dark:text-blue-100">
                        {doubt.aiExplanation}
                      </p>
                    </div>

                    {/* Instructor Reply */}
                    {doubt.instructorReply && (
                      <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/50">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                          <span className="text-xs font-medium text-green-700 dark:text-green-400">
                            Your Reply
                          </span>
                        </div>
                        <p className="text-sm text-green-900 dark:text-green-100">
                          {doubt.instructorReply}
                        </p>
                      </div>
                    )}

                    {/* Reply Form */}
                    {doubt.status === "pending" && (
                      <div className="space-y-3">
                        {replyingTo === doubt.id ? (
                          <>
                            <Textarea
                              placeholder="Add your clarifying explanation..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              rows={3}
                              className="text-sm"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleReply(doubt.id)}
                                disabled={!replyText.trim()}
                              >
                                <Send className="w-4 h-4 mr-1.5" />
                                Send & Resolve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyText("");
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </>
                        ) : (
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => setReplyingTo(doubt.id)}>
                              <MessageCircle className="w-4 h-4 mr-1.5" />
                              Reply
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onMarkResolved?.(doubt.id)}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1.5" />
                              Mark AI Response Sufficient
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">No doubts found</p>
            <p className="text-sm text-muted-foreground mt-1">
              {filter !== "all"
                ? `No ${filter} doubts at the moment`
                : "Student doubts will appear here"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DoubtManagementTab;
