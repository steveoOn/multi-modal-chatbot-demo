"use client";
import { Message } from "ai";
import { useState } from "react";
import Markdown from "react-markdown";

const defaultMessages: Message[] = [
  {
    id: "1",
    role: "user",
    content: "describe image",
    experimental_attachments: [
      {
        name: "iShot_2024-01-14_11.45.50.png",
        contentType: "image/png",
        url: "data:image/png;base64,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",
      },
    ],
  },
];

function customParse(jsonString: string): any {
  return JSON.parse(jsonString, (key, value) => {
    if (value && typeof value === "object" && value.type === "Uint8Array") {
      return new Uint8Array(
        atob(value.data)
          .split("")
          .map((char) => char.charCodeAt(0))
      );
    }
    return value;
  });
}

async function getCoreMessages(messages: Message[]) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages }),
  });

  const data = customParse(JSON.stringify(await res.json()));
  return data;
}

export default function Home() {
  const [coreMessages, setCoreMessages] = useState([]);
  const [text, setText] = useState(JSON.stringify(defaultMessages, null, 2));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMessages = async () => {
    try {
      setError("");
      setLoading(true);
      const messages = JSON.parse(text);
      const res = await getCoreMessages(messages);
      setCoreMessages(res);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError(getErrorMessage(error));
      setCoreMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    return "An unknown error occurred. See console for more details.";
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="z-10 w-full max-w-5xl items-center font-mono text-sm">
        <p>test convertToCoreMessages.</p>
        <textarea
          className="border border-gray-500 rounded-md p-2 my-4 w-full max-w-5xl height-96 dark:bg-gray-800"
          rows={10}
          cols={30}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {error && <p className="text-red-500">{error}</p>}
        {loading ? (
          "loading..."
        ) : (
          <button
            onClick={handleMessages}
            type="button"
            className="border border-gray-500 rounded-md p-2 my-4"
          >
            Convert
          </button>
        )}
        <pre className="max-w-5xl overflow-scroll border border-gray-400 rounded-md p-2">
          {JSON.stringify(coreMessages, null, 2)}
        </pre>
        {(coreMessages as any).error && (coreMessages as any).stack && (
          <div className="mt-4">
            <h3>Stack Trace:</h3>
            <Markdown>{(coreMessages as any).stack}</Markdown>
          </div>
        )}
      </div>
    </main>
  );
}
