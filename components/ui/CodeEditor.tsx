// components/Editor.tsx
"use client";

import Editor from "@monaco-editor/react";

export default function CodeEditor() {
  return (
    <div className="h-[500px] border rounded-md overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage="javascript"
        defaultValue="// Write your code here."
        theme="vs-dark"
      />
    </div>
  );
}
