"use client";
import { Message } from "ai";
import { useState } from "react";
import Markdown from "react-markdown";

const defaultMessages: Message[] = [
  {
    id: "1",
    role: "user",
    content: "Hello, world!",
  },
  {
    id: "2",
    role: "assistant",
    content: "Hi there! Steven here.",
  },
];

async function getCoreMessages(messages: Message[]) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages }),
  });
  return res.json();
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
      console.error("Error converting messages:", error);
      setCoreMessages([]);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred. see console for more details.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="z-10 w-full max-w-5xl items-center font-mono text-sm">
        <p>test convertToCoreMessages.</p>
        <textarea
          defaultValue={text}
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
