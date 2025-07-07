"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CodeEditor from "@/components/ui/CodeEditor";
import { getCards, Card } from "@/actions/cardActions";
import { FileText, ArrowLeft, Eye, EyeOff, Check, X } from "lucide-react";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "scala", label: "Scala" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "sql", label: "SQL" },
  { value: "bash", label: "Bash" },
  { value: "powershell", label: "PowerShell" },
  { value: "markdown", label: "Markdown" },
  { value: "json", label: "JSON" },
  { value: "yaml", label: "YAML" },
  { value: "xml", label: "XML" },
  { value: "text", label: "Text" },
];

// Function to detect if content is code or text
const isCodeContent = (content: string): boolean => {
  const codePatterns = [
    /[{}()\[\]]/, // Braces and brackets
    /[;=+\-*/<>!&|]/, // Common operators
    /function\s*\(/, // Function declarations
    /const\s+|let\s+|var\s+/, // Variable declarations
    /if\s*\(|for\s*\(|while\s*\(/, // Control structures
    /import\s+|export\s+/, // Module statements
    /class\s+\w+/, // Class declarations
    /=>\s*/, // Arrow functions
    /console\./, // Console statements
    /return\s+/, // Return statements
    /^\s*\/\//, // Single line comments
    /^\s*\/\*/, // Multi-line comments
    /^\s*#/, // Hash comments (Python, shell)
    /^\s*<!--/, // HTML comments
    /^\s*\/\//, // JavaScript comments
  ];

  const lines = content.split("\n");
  let codeLines = 0;
  let totalLines = lines.length;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine === "") continue;

    for (const pattern of codePatterns) {
      if (pattern.test(trimmedLine)) {
        codeLines++;
        break;
      }
    }
  }

  return totalLines > 0 && codeLines / totalLines > 0.3;
};

export default function PracticePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cardId = searchParams.get("id");

  const [card, setCard] = useState<Card | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [answerType, setAnswerType] = useState<"text" | "code">("code");

  useEffect(() => {
    if (cardId) {
      loadCard();
    } else {
      setIsLoading(false);
    }
  }, [cardId]);

  const loadCard = async () => {
    try {
      const cards = await getCards();
      const foundCard = cards.find((c) => c.id === cardId);
      if (foundCard) {
        setCard(foundCard);
        setAnswerType(isCodeContent(foundCard.answer) ? "code" : "text");
      } else {
        toast.error("Card not found");
        router.push("/dashboard/cards");
      }
    } catch (error) {
      console.error("Card fetch error:", error);
      toast.error("Failed to load card");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  const handleCorrect = () => {
    toast.success("Great job! Keep practicing!");
    // TODO: Implement review tracking
    router.push("/dashboard/cards");
  };

  const handleIncorrect = () => {
    toast.error("Don't worry, practice makes perfect!");
    // TODO: Implement review tracking
    router.push("/dashboard/cards");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Loading...
          </div>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Card not found</h3>
          <p className="text-muted-foreground mb-6">
            The card you're looking for doesn't exist.
          </p>
          <Link href="/dashboard/cards">
            <Button>Back to Cards</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="mb-4">
        <Link
          href="/dashboard/cards"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cards
        </Link>
        <h1 className="text-3xl font-bold mt-2">Practice Card</h1>
        <p className="text-muted-foreground mt-2">
          Test your knowledge with this flashcard
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Question Section */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Question</label>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {isCodeContent(card.question)
                      ? "Code question"
                      : "Text question"}
                  </span>
                </div>
              </div>

              {isCodeContent(card.question) ? (
                <CodeEditor
                  value={card.question}
                  onChange={() => {}} // Read-only
                  language={card.language}
                  placeholder="// Question here"
                  height="500px"
                />
              ) : (
                <Textarea
                  value={card.question}
                  onChange={() => {}} // Read-only
                  placeholder="Question here"
                  className="min-h-[500px]"
                  readOnly
                />
              )}
            </div>
          </div>
        </div>

        {/* Answer Section */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Answer</label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShowAnswer}
                className="flex items-center gap-2"
              >
                {showAnswer ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    Hide Answer
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    Show Answer
                  </>
                )}
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {isCodeContent(card.answer) ? "Code answer" : "Text answer"}
                  </span>
                </div>
              </div>

              {showAnswer ? (
                isCodeContent(card.answer) ? (
                  <CodeEditor
                    value={card.answer}
                    onChange={() => {}} // Read-only
                    language={card.language}
                    placeholder="// Answer here"
                    height="500px"
                  />
                ) : (
                  <Textarea
                    value={card.answer}
                    onChange={() => {}} // Read-only
                    placeholder="Answer here"
                    className="min-h-[500px]"
                    readOnly
                  />
                )
              ) : isCodeContent(card.answer) ? (
                <CodeEditor
                  value=""
                  onChange={setUserAnswer}
                  language={card.language}
                  placeholder="// Write your answer here..."
                  height="500px"
                />
              ) : (
                <Textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Write your answer here..."
                  className="min-h-[500px]"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Language and Tags Info */}
      <div className="mt-6 space-y-4">
        <div className="flex gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Programming Language
            </label>
            <div className="text-sm text-muted-foreground">
              {languages.find((lang) => lang.value === card.language)?.label ||
                card.language}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Tags</label>
            <div className="flex flex-wrap gap-1">
              {card.tags && card.tags.length > 0 ? (
                card.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No tags</span>
              )}
            </div>
          </div>
        </div>

        {/* Practice Actions */}
        <div className="flex gap-4 pt-4 border-t">
          <Button
            onClick={handleCorrect}
            className="flex items-center gap-2"
            variant="default"
          >
            <Check className="h-4 w-4" />I Got It Right
          </Button>
          <Button
            onClick={handleIncorrect}
            className="flex items-center gap-2"
            variant="outline"
          >
            <X className="h-4 w-4" />I Need More Practice
          </Button>
        </div>
      </div>
    </div>
  );
}
