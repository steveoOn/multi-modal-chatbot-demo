"use client";
import { Message } from "ai";
import { useState } from "react";

const messages: Message[] = [
  {
    id: "1",
    role: "user",
    content: "Hello, world!",
  },
  {
    id: "2",
    role: "assistant",
    content: "Hi there! Steven",
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

  const handleMessages = async () => {
    const res = await getCoreMessages(messages);
    setCoreMessages(res);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="z-10 w-full max-w-5xl items-center font-mono text-sm">
        <p>test convertToCoreMessages.</p>
        <button
          onClick={handleMessages}
          type="button"
          className="border border-gray-500 rounded-md p-2 my-4"
        >
          Convert
        </button>
        <pre>{JSON.stringify(coreMessages, null, 2)}</pre>
      </div>
    </main>
  );
}
