"use client";

import Editor from "@monaco-editor/react";
import { useState, useEffect } from "react";

interface CodeEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  language?: string;
  placeholder?: string;
  height?: string;
}

export default function CodeEditor({
  value = "",
  onChange,
  language = "javascript",
  placeholder = "// Write your code here.",
  height = "500px",
}: CodeEditorProps) {
  const [editorValue, setEditorValue] = useState(value);

  // Sync internal state with external value
  useEffect(() => {
    setEditorValue(value);
  }, [value]);

  const handleEditorChange = (value: string | undefined) => {
    const newValue = value || "";
    setEditorValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="border rounded-md overflow-hidden" style={{ height }}>
      <Editor
        height="100%"
        language={language}
        value={editorValue}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}
