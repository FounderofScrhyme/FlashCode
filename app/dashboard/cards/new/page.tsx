"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Sandpack } from "@codesandbox/sandpack-react";
import CodeEditor from "@/components/ui/CodeEditor";
import ExecutableCodeEditor from "@/components/ui/ExecutableCodeEditor";

export default function CreateCard() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [language, setLanguage] = useState("JavaScript");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim() || !answer.trim()) {
      alert("Question and answer are required.");
      return;
    }

    const res = await fetch("/api/cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, answer, language }),
    });

    if (res.ok) {
      router.push("/dashboard/cards/new");
    } else {
      alert("Failed to create card.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-xl font-bold mb-4">Create New Card</h1>

      <CodeEditor />

      <ExecutableCodeEditor />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-2">Question</label>
          <textarea
            className="w-full border rounded p-2 bg-blue-100"
            rows={6}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={"Write an example of map()"}
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Answer</label>
          <textarea
            className="w-full border rounded p-2 bg-blue-100"
            rows={6}
            value={question}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={"Write an example of map()"}
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
          </select>
        </div>

        <Button type="submit">Create</Button>
      </form>
    </div>
  );
}
