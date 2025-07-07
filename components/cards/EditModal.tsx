"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import CodeEditor from "@/components/ui/CodeEditor";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/actions/cardActions";
import { X } from "lucide-react";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    question: string;
    answer: string;
    language: string;
    tags: string[];
  }) => void;
  card: Card | null;
}

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

  // If more than 30% of non-empty lines contain code patterns, consider it code
  return totalLines > 0 && codeLines / totalLines > 0.3;
};

export default function EditModal({
  isOpen,
  onClose,
  onSave,
  card,
}: EditModalProps) {
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    language: "",
    tags: [] as string[],
  });

  useEffect(() => {
    if (card) {
      setFormData({
        question: card.question,
        answer: card.answer,
        language: card.language,
        tags: card.tags,
      });
    }
  }, [card]);

  if (!isOpen || !card) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleTagsChange = (value: string) => {
    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    setFormData((prev) => ({ ...prev, tags }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background border rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Edit Card</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Language</label>
            <input
              type="text"
              value={formData.language}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, language: e.target.value }))
              }
              className="w-full p-2 border rounded-md bg-background"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Question</label>
            {isCodeContent(formData.question) ? (
              <CodeEditor
                value={formData.question}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, question: value }))
                }
                language={formData.language.toLowerCase()}
                placeholder="// Write your question here..."
                height="200px"
              />
            ) : (
              <Textarea
                value={formData.question}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, question: e.target.value }))
                }
                placeholder="Enter your question here..."
                className="min-h-[200px] font-mono"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Answer</label>
            {isCodeContent(formData.answer) ? (
              <CodeEditor
                value={formData.answer}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, answer: value }))
                }
                language={formData.language.toLowerCase()}
                placeholder="// Write your answer here..."
                height="200px"
              />
            ) : (
              <Textarea
                value={formData.answer}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, answer: e.target.value }))
                }
                placeholder="Enter your answer here..."
                className="min-h-[200px] font-mono"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags.join(", ")}
              onChange={(e) => handleTagsChange(e.target.value)}
              className="w-full p-2 border rounded-md bg-background"
              placeholder="tag1, tag2, tag3"
            />
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
