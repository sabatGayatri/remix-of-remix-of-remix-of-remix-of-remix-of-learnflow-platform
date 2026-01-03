import { useState, useEffect, useRef } from "react";
import {
  Upload,
  Plus,
  Trash2,
  Video,
  Clock,
  Users,
  MessageCircle,
  FileText,
  Play,
  Edit3,
  GripVertical,
  FileVideo,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { curriculumData, getDomain } from "@/data/curriculum";
import { useVideos, Video as VideoType } from "@/hooks/useVideos";
import { useToast } from "@/hooks/use-toast";

interface Timestamp {
  id: number;
  time: string;
  title: string;
  explanation: string;
}

interface UploadedVideo {
  id: number;
  title: string;
  domain: string;
  difficulty: string;
  topic: string;
  duration: string;
  views: number;
  doubts: number;
  hasTranscript: boolean;
}

interface ContentManagementTabProps {
  uploadedVideos?: UploadedVideo[];
  onUploadVideo?: (data: {
    title: string;
    description: string;
    domain: string;
    difficulty: string;
    transcription: string;
    estimatedTime: string;
    timestamps: Timestamp[];
  }) => void;
}

const ContentManagementTab = ({
  uploadedVideos: propVideos = [],
  onUploadVideo,
}: ContentManagementTabProps) => {
  const [timestamps, setTimestamps] = useState<Timestamp[]>([
    { id: 1, time: "0:00", title: "Introduction", explanation: "" },
  ]);
  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { videos, isLoading, fetchInstructorVideos, uploadVideo, deleteVideo, getVideoUrl } = useVideos();
  const { toast } = useToast();

  useEffect(() => {
    fetchInstructorVideos();
  }, [fetchInstructorVideos]);

  const addTimestamp = () => {
    setTimestamps([
      ...timestamps,
      { id: Date.now(), time: "", title: "", explanation: "" },
    ]);
  };

  const removeTimestamp = (id: number) => {
    if (timestamps.length > 1) {
      setTimestamps(timestamps.filter((t) => t.id !== id));
    }
  };

  const updateTimestamp = (
    id: number,
    field: keyof Timestamp,
    value: string
  ) => {
    setTimestamps(
      timestamps.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const domain = selectedDomain ? getDomain(selectedDomain) : null;
  const difficulties = domain ? domain.difficulties.map((d) => d.id) : [];
  const selectedDiff = domain?.difficulties.find(d => d.id === selectedDifficulty);
  const topics = selectedDiff ? selectedDiff.topics.map((t) => t.id) : [];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith("video/")) {
      setVideoFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && files[0].type.startsWith("video/")) {
      setVideoFile(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!videoFile || !title || !selectedDomain || !selectedDifficulty || !selectedTopic) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields and select a video",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    const result = await uploadVideo({
      title,
      description,
      domain: selectedDomain,
      topic: selectedTopic,
      difficulty: selectedDifficulty,
      file: videoFile,
    });
    setIsUploading(false);

    if (result.success) {
      toast({
        title: "Video uploaded!",
        description: "Your video has been uploaded successfully",
      });
      // Reset form
      setTitle("");
      setDescription("");
      setVideoFile(null);
      setSelectedDomain("");
      setSelectedDifficulty("");
      setSelectedTopic("");
      setTimestamps([{ id: 1, time: "0:00", title: "Introduction", explanation: "" }]);
    } else {
      toast({
        title: "Upload failed",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    const result = await deleteVideo(videoId);
    if (result.success) {
      toast({
        title: "Video deleted",
        description: "The video has been removed",
      });
    } else {
      toast({
        title: "Delete failed",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  // Combine prop videos with database videos
  const displayVideos = videos.length > 0 ? videos : propVideos;

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload New Video */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Upload className="w-5 h-5 text-primary" />
              Upload New Video
            </CardTitle>
            <CardDescription>
              Add a new problem-solving video to your content library
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Upload area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : videoFile
                  ? "border-green-500 bg-green-50 dark:bg-green-900/10"
                  : "border-border hover:border-primary/50 bg-muted/30"
              }`}
            >
              {videoFile ? (
                <div className="space-y-2">
                  <FileVideo className="w-10 h-10 text-green-600 dark:text-green-400 mx-auto" />
                  <p className="font-medium text-sm">{videoFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setVideoFile(null)}
                    className="text-destructive hover:text-destructive"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium mb-1">
                    Drag and drop your video here
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    MP4, WebM up to 500MB
                  </p>
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    Browse Files
                  </Button>
                </>
              )}
            </div>

            {/* Video details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Video Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g., Two Sum - Complete Solution"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Problem Statement</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the problem being solved in this video..."
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Hierarchy Selection */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label>Domain</Label>
                  <Select value={selectedDomain} onValueChange={(v) => { setSelectedDomain(v); setSelectedDifficulty(""); setSelectedTopic(""); }}>
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

                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <Select
                    value={selectedDifficulty}
                    onValueChange={(v) => { setSelectedDifficulty(v); setSelectedTopic(""); }}
                    disabled={!selectedDomain}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Difficulty" />
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

                <div className="space-y-2">
                  <Label>Topic</Label>
                  <Select
                    value={selectedTopic}
                    onValueChange={setSelectedTopic}
                    disabled={!selectedDifficulty}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {topics.map((topic) => (
                        <SelectItem key={topic} value={topic}>
                          {topic.charAt(0).toUpperCase() + topic.slice(1).replace(/-/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleFileSelect}
              />

              {/* Transcription */}
              <div className="space-y-2">
                <Label htmlFor="transcription" className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Transcription (for AI understanding)
                </Label>
                <Textarea
                  id="transcription"
                  placeholder="Paste or type the video transcription here. This helps AI understand and explain the content to students..."
                  rows={4}
                  className="text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  The AI uses this transcription to answer student doubts accurately
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timestamp Editor */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5 text-primary" />
                  Timestamp Editor
                </CardTitle>
                <CardDescription className="mt-1">
                  Create step-by-step guidance for students
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={addTimestamp}>
                <Plus className="w-4 h-4 mr-1" />
                Add Step
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
              {timestamps.map((ts, index) => (
                <div
                  key={ts.id}
                  className="p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <GripVertical className="w-4 h-4 text-muted-foreground/50 cursor-grab" />
                    <Badge
                      variant="secondary"
                      className="w-7 h-7 rounded-full flex items-center justify-center p-0 text-xs font-medium"
                    >
                      {index + 1}
                    </Badge>
                    <Input
                      placeholder="0:00"
                      className="w-20 h-8 text-sm"
                      value={ts.time}
                      onChange={(e) =>
                        updateTimestamp(ts.id, "time", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Step title (e.g., Understanding the problem)"
                      className="flex-1 h-8 text-sm"
                      value={ts.title}
                      onChange={(e) =>
                        updateTimestamp(ts.id, "title", e.target.value)
                      }
                    />
                    {timestamps.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTimestamp(ts.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <Textarea
                    placeholder="Explanation for this step (shown to students as guidance)..."
                    rows={2}
                    value={ts.explanation}
                    onChange={(e) =>
                      updateTimestamp(ts.id, "explanation", e.target.value)
                    }
                    className="text-sm resize-none"
                  />
                </div>
              ))}
            </div>

            <Button className="w-full mt-5" onClick={handleUpload} disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Video
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Uploaded Videos List */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Video className="w-5 h-5 text-primary" />
            Your Videos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 mx-auto animate-spin text-muted-foreground" />
              <p className="text-muted-foreground mt-2">Loading videos...</p>
            </div>
          ) : displayVideos.length > 0 ? (
            <div className="space-y-3">
              {displayVideos.map((video) => (
                <div
                  key={video.id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all group"
                >
                  <div className="w-28 h-16 rounded-lg bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center flex-shrink-0 relative cursor-pointer overflow-hidden">
                    <Play className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{video.title}</h3>
                      {'hasTranscript' in video && video.hasTranscript && (
                        <Badge variant="secondary" className="text-xs flex-shrink-0">
                          <FileText className="w-3 h-3 mr-1" />
                          Transcribed
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {video.domain}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {video.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {video.topic}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {'duration' in video ? video.duration : `${Math.floor((video as VideoType).duration_seconds || 0 / 60)}m`}
                      </span>
                      {'views' in video && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {video.views} views
                        </span>
                      )}
                      {'doubts' in video && video.doubts > 0 && (
                        <span className="flex items-center gap-1 text-primary font-medium">
                          <MessageCircle className="w-3.5 h-3.5" />
                          {video.doubts} doubts
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="outline" size="sm">
                      <Edit3 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => handleDeleteVideo(video.id.toString())}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Video className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">No videos uploaded yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Upload your first video to get started
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentManagementTab;
