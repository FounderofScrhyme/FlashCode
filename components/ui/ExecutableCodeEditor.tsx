"use client";

import { Sandpack } from "@codesandbox/sandpack-react";
import Editor from "@monaco-editor/react";

export default function ExecutableCodeEditor() {
  return (
    <div className="h-[500px] border rounded-md overflow-hidden">
      <Sandpack
        template="react"
        theme="dark"
        options={{
          showTabs: true,
          showConsole: true,
          editorHeight: 400,
        }}
      />
    </div>
  );
}
