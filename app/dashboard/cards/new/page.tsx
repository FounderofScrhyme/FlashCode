"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CodeEditor from "@/components/ui/CodeEditor";
import { createCard } from "@/actions/cardActions";
import { FileText, Plus, ArrowLeft } from "lucide-react";
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

export default function NewCardPage() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [questionType, setQuestionType] = useState<"text" | "code">("text");
  const [answerType, setAnswerType] = useState<"text" | "code">("code");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim() || !answer.trim()) {
      toast.error("Please enter both question and answer");
      return;
    }

    setIsLoading(true);

    try {
      await createCard({
        question: question.trim(),
        answer: answer.trim(),
        language,
        tags,
      });

      router.push("/dashboard/cards");
    } catch (error) {
      console.error("Card creation error:", error);
      toast(error instanceof Error ? error.message : "Failed to create card");
    } finally {
      setIsLoading(false);
    }
  };

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
        <h1 className="text-3xl font-bold mt-2">Create New Card</h1>
        <p className="text-muted-foreground mt-2">
          Create a flashcard specialized for code memorization
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 質問セクション */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Question</label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Enter code or text
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Type:</span>
                    <Select
                      value={questionType}
                      onValueChange={(value: "text" | "code") =>
                        setQuestionType(value)
                      }
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="code">Code</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {questionType === "text" ? (
                  <Textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Enter your question here"
                    className="min-h-[500px]"
                  />
                ) : (
                  <CodeEditor
                    value={question}
                    onChange={setQuestion}
                    language={language}
                    placeholder="// Enter your question here"
                    height="500px"
                  />
                )}
              </div>
            </div>
          </div>

          {/* 答えセクション */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Answer</label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Enter the correct code or text
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Type:</span>
                    <Select
                      value={answerType}
                      onValueChange={(value: "text" | "code") =>
                        setAnswerType(value)
                      }
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="code">Code</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {answerType === "text" ? (
                  <Textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Enter your answer here"
                    className="min-h-[500px]"
                  />
                ) : (
                  <CodeEditor
                    value={answer}
                    onChange={setAnswer}
                    language={language}
                    placeholder="// Enter your answer here"
                    height="500px"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 言語選択 */}
        <div className="max-w-xs">
          <label className="text-sm font-medium mb-2 block">
            Programming Language
          </label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* タグ入力 */}
        <div className="max-w-md">
          <label className="text-sm font-medium mb-2 block">Tags</label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
                      setTags([...tags, tagInput.trim()]);
                      setTagInput("");
                    }
                  }
                }}
                placeholder="Enter tag and press Enter"
                className="flex-1 px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (tagInput.trim() && !tags.includes(tagInput.trim())) {
                    setTags([...tags, tagInput.trim()]);
                    setTagInput("");
                  }
                }}
                disabled={!tagInput.trim() || tags.includes(tagInput.trim())}
              >
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() =>
                        setTags(tags.filter((_, i) => i !== index))
                      }
                      className="text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 送信ボタン */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isLoading || !question.trim() || !answer.trim()}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {isLoading ? "Creating..." : "Create Card"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/cards/new")}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
