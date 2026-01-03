import { useState } from "react";
import {
  Bot,
  Edit3,
  Save,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  BookOpen,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface AIExplanation {
  id: number;
  question: string;
  topic: string;
  originalExplanation: string;
  improvedExplanation?: string;
  rating: "good" | "needs-improvement" | "pending";
  usageCount: number;
  lastUsed: string;
}

interface AICollaborationTabProps {
  explanations?: AIExplanation[];
  onImprove?: (id: number, improvedText: string) => void;
  onRate?: (id: number, rating: "good" | "needs-improvement") => void;
  onRegenerate?: (id: number) => void;
}

const AICollaborationTab = ({
  explanations = [],
  onImprove,
  onRate,
  onRegenerate,
}: AICollaborationTabProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const approvedCount = explanations.filter((e) => e.rating === "good").length;
  const needsReviewCount = explanations.filter((e) => e.rating === "needs-improvement").length;
  const enhancedCount = explanations.filter((e) => e.improvedExplanation).length;

  const startEditing = (explanation: AIExplanation) => {
    setEditingId(explanation.id);
    setEditText(
      explanation.improvedExplanation || explanation.originalExplanation
    );
  };

  const saveImprovement = (id: number) => {
    onImprove?.(id, editText);
    setEditingId(null);
    setEditText("");
  };

  const rateExplanation = (id: number, rating: "good" | "needs-improvement") => {
    onRate?.(id, rating);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0">
              <Bot className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold mb-1">AI Explanation Library</h2>
              <p className="text-sm text-muted-foreground">
                Review, rate, and improve AI-generated explanations. Your
                improvements are stored and reused for similar questions.
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {explanations.length}
              </p>
              <p className="text-xs text-muted-foreground">Total Explanations</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <ThumbsUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xl font-bold">{approvedCount}</p>
              <p className="text-sm text-muted-foreground">Approved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xl font-bold">{needsReviewCount}</p>
              <p className="text-sm text-muted-foreground">Needs Review</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xl font-bold">{enhancedCount}</p>
              <p className="text-sm text-muted-foreground">Enhanced</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Explanations List */}
      {explanations.length > 0 ? (
        <div className="space-y-4">
          {explanations.map((explanation) => (
            <Card key={explanation.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="truncate">{explanation.question}</span>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {explanation.topic}
                    </CardDescription>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      explanation.rating === "good"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : explanation.rating === "needs-improvement"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    }
                  >
                    {explanation.rating === "good"
                      ? "Approved"
                      : explanation.rating === "needs-improvement"
                      ? "Needs Review"
                      : "Pending"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Usage Stats */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Used {explanation.usageCount} times
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {explanation.lastUsed}
                  </span>
                </div>

                {/* Original AI Explanation */}
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">
                    Original AI Explanation
                  </p>
                  <p className="text-sm">{explanation.originalExplanation}</p>
                </div>

                {/* Improved Explanation or Editor */}
                {editingId === explanation.id ? (
                  <div className="space-y-3">
                    <Textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      placeholder="Write an improved explanation..."
                      rows={4}
                      className="text-sm"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => saveImprovement(explanation.id)}
                      >
                        <Save className="w-4 h-4 mr-1.5" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingId(null);
                          setEditText("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : explanation.improvedExplanation ? (
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/50">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-xs font-medium text-green-700 dark:text-green-400">
                        Your Improved Explanation
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2"
                        onClick={() => startEditing(explanation)}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    <p className="text-sm text-green-900 dark:text-green-100">
                      {explanation.improvedExplanation}
                    </p>
                  </div>
                ) : null}

                {/* Actions */}
                {editingId !== explanation.id && (
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={explanation.rating === "good" ? "default" : "outline"}
                        className={
                          explanation.rating === "good"
                            ? "bg-green-600 hover:bg-green-700"
                            : ""
                        }
                        onClick={() => rateExplanation(explanation.id, "good")}
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant={
                          explanation.rating === "needs-improvement"
                            ? "default"
                            : "outline"
                        }
                        className={
                          explanation.rating === "needs-improvement"
                            ? "bg-amber-600 hover:bg-amber-700"
                            : ""
                        }
                        onClick={() =>
                          rateExplanation(explanation.id, "needs-improvement")
                        }
                      >
                        <ThumbsDown className="w-4 h-4 mr-1" />
                        Needs Work
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEditing(explanation)}
                      >
                        <Edit3 className="w-4 h-4 mr-1" />
                        Improve
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onRegenerate?.(explanation.id)}
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">No AI explanations yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              AI explanations will appear here as students ask questions
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AICollaborationTab;
