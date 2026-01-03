import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, BookOpen, FileQuestion, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { curriculumData, Domain, Topic, Question } from "@/data/curriculum";

interface SearchResult {
  type: "domain" | "topic" | "question";
  title: string;
  subtitle?: string;
  path: string;
}

const GlobalSearch = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Build searchable index from curriculum data
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    curriculumData.forEach((domain: Domain) => {
      // Search domains
      if (domain.name.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: "domain",
          title: domain.name,
          path: `/domains`,
        });
      }

      domain.difficulties.forEach((difficulty) => {
        difficulty.topics.forEach((topic: Topic) => {
          // Search topics
          if (topic.name.toLowerCase().includes(lowerQuery)) {
            results.push({
              type: "topic",
              title: topic.name,
              subtitle: `${domain.name} • ${difficulty.name}`,
              path: `/domains/${domain.id}/${difficulty.id}/${topic.id}/questions`,
            });
          }

          // Search questions
          topic.questions.forEach((question: Question) => {
            if (question.title.toLowerCase().includes(lowerQuery)) {
              results.push({
                type: "question",
                title: question.title,
                subtitle: `${topic.name} • ${difficulty.name}`,
                path: `/solve/${question.id}`,
              });
            }
          });
        });
      });
    });

    return results.slice(0, 8); // Limit to 8 results
  }, [query]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && searchResults[selectedIndex]) {
      e.preventDefault();
      handleSelect(searchResults[selectedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setQuery("");
    }
  };

  const handleSelect = (result: SearchResult) => {
    navigate(result.path);
    setQuery("");
    setIsOpen(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "domain":
        return <Layers className="w-4 h-4 text-primary" />;
      case "topic":
        return <BookOpen className="w-4 h-4 text-primary" />;
      case "question":
        return <FileQuestion className="w-4 h-4 text-primary" />;
      default:
        return <Search className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xs">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search topics, questions..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="pl-9 pr-8 h-9 text-sm bg-muted/50 border-border focus:bg-background"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
          {searchResults.length > 0 ? (
            <ul className="py-2">
              {searchResults.map((result, index) => (
                <li key={`${result.type}-${result.path}-${index}`}>
                  <button
                    onClick={() => handleSelect(result)}
                    className={`w-full px-4 py-2 flex items-start gap-3 text-left transition-colors ${
                      index === selectedIndex ? "bg-muted" : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="mt-0.5">{getIcon(result.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{result.title}</p>
                      {result.subtitle && (
                        <p className="text-xs text-muted-foreground truncate">
                          {result.subtitle}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground capitalize px-2 py-0.5 bg-muted rounded">
                      {result.type}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
