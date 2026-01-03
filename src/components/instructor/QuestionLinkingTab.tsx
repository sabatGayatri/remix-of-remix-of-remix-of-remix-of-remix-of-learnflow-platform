import { useState } from "react";
import { Link2, Check, Video, Search, ChevronRight, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { curriculumData, getDomain, getDifficulty, getTopic } from "@/data/curriculum";

interface UnlinkedVideo {
  id: number;
  title: string;
  duration: string;
}

interface LinkedVideo {
  id: number;
  title: string;
  domain: string;
  difficulty: string;
  topic: string;
  question: string;
}

interface QuestionLinkingTabProps {
  unlinkedVideos?: UnlinkedVideo[];
  linkedVideos?: LinkedVideo[];
  onLink?: (videoId: number, mapping: {
    domain: string;
    difficulty: string;
    topic: string;
    question: string;
  }) => void;
}

const QuestionLinkingTab = ({
  unlinkedVideos = [],
  linkedVideos = [],
  onLink,
}: QuestionLinkingTabProps) => {
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const domain = selectedDomain ? getDomain(selectedDomain) : null;
  const difficulties = domain ? domain.difficulties.map((d) => d.id) : [];

  const difficultyData =
    selectedDomain && selectedDifficulty
      ? getDifficulty(selectedDomain, selectedDifficulty)
      : null;
  const topics = difficultyData ? difficultyData.topics : [];

  const topicData =
    selectedDomain && selectedDifficulty && selectedTopic
      ? getTopic(selectedDomain, selectedDifficulty, selectedTopic)
      : null;
  const questions = topicData ? topicData.questions : [];

  const filteredLinkedVideos = linkedVideos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLink = () => {
    if (selectedVideo && selectedQuestion) {
      onLink?.(selectedVideo, {
        domain: selectedDomain,
        difficulty: selectedDifficulty,
        topic: selectedTopic,
        question: selectedQuestion,
      });
      // Reset selections
      setSelectedVideo(null);
      setSelectedDomain("");
      setSelectedDifficulty("");
      setSelectedTopic("");
      setSelectedQuestion("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Unlinked Videos */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Video className="w-5 h-5 text-primary" />
              Unlinked Videos
            </CardTitle>
            <CardDescription>
              Select a video to link it to a curriculum question
            </CardDescription>
          </CardHeader>
          <CardContent>
            {unlinkedVideos.length > 0 ? (
              <div className="space-y-2">
                {unlinkedVideos.map((video) => (
                  <button
                    key={video.id}
                    onClick={() => setSelectedVideo(video.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-lg border text-left transition-all ${
                      selectedVideo === video.id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="w-14 h-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                      <Video className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{video.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {video.duration}
                      </p>
                    </div>
                    {selectedVideo === video.id && (
                      <Badge className="bg-primary text-primary-foreground flex-shrink-0">
                        Selected
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Video className="w-10 h-10 mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">No unlinked videos</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Linking Form */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Link2 className="w-5 h-5 text-primary" />
              Link to Question
            </CardTitle>
            <CardDescription>
              Map the selected video to curriculum hierarchy
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedVideo ? (
              <div className="space-y-4">
                {/* Domain */}
                <div className="space-y-2">
                  <Label>Domain</Label>
                  <Select
                    value={selectedDomain}
                    onValueChange={(val) => {
                      setSelectedDomain(val);
                      setSelectedDifficulty("");
                      setSelectedTopic("");
                      setSelectedQuestion("");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Domain" />
                    </SelectTrigger>
                    <SelectContent>
                      {curriculumData.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Difficulty */}
                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <Select
                    value={selectedDifficulty}
                    onValueChange={(val) => {
                      setSelectedDifficulty(val);
                      setSelectedTopic("");
                      setSelectedQuestion("");
                    }}
                    disabled={!selectedDomain}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map((diff) => (
                        <SelectItem key={diff} value={diff}>
                          {diff.charAt(0).toUpperCase() + diff.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Topic */}
                <div className="space-y-2">
                  <Label>Topic</Label>
                  <Select
                    value={selectedTopic}
                    onValueChange={(val) => {
                      setSelectedTopic(val);
                      setSelectedQuestion("");
                    }}
                    disabled={!selectedDifficulty}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {topics.map((topic) => (
                        <SelectItem key={topic.id} value={topic.id}>
                          {topic.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Question */}
                <div className="space-y-2">
                  <Label>Question</Label>
                  <Select
                    value={selectedQuestion}
                    onValueChange={setSelectedQuestion}
                    disabled={!selectedTopic}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Question" />
                    </SelectTrigger>
                    <SelectContent>
                      {questions.map((q) => (
                        <SelectItem key={q.id} value={q.id}>
                          {q.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full mt-2"
                  onClick={handleLink}
                  disabled={!selectedQuestion}
                >
                  <Link2 className="w-4 h-4 mr-2" />
                  Link Video to Question
                </Button>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Link2 className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Select a video from the left to link it</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Already Linked Videos */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Check className="w-5 h-5 text-primary" />
                Linked Videos
              </CardTitle>
              <CardDescription className="mt-1">
                {linkedVideos.length} video{linkedVideos.length !== 1 ? "s" : ""} linked to curriculum
              </CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search linked videos..."
                className="pl-9 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredLinkedVideos.length > 0 ? (
            <div className="space-y-2">
              {filteredLinkedVideos.map((video) => (
                <div
                  key={video.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{video.title}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1 flex-wrap">
                      <span>{video.domain}</span>
                      <ChevronRight className="w-3 h-3" />
                      <span>{video.difficulty}</span>
                      <ChevronRight className="w-3 h-3" />
                      <span>{video.topic}</span>
                      <ChevronRight className="w-3 h-3" />
                      <span className="text-foreground font-medium truncate">
                        {video.question}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                  >
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="w-10 h-10 mx-auto text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "No matching videos found" : "No linked videos yet"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionLinkingTab;
