import { convertMessagesToCoreMessages } from "@/lib/utils";

export const runtime = "edge";
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  console.log("🐞 start to convert core messages...");
  const coreMessages = convertMessagesToCoreMessages(messages);

  console.log("🐞 coreMessages after converted:");
  coreMessages.forEach((msg, index) => {
    console.log(`Message ${index}:`);
    console.log(`  Role: ${msg.role}`);

    if (typeof msg.content === "string") {
      console.log(`  Content: ${msg.content.substring(0, 100)}...`);
    } else if (Array.isArray(msg.content)) {
      console.log("  Content:");
      msg.content.forEach((part, partIndex) => {
        if (part.type === "text") {
          console.log(
            `    Part ${partIndex} (Text): ${part.text.substring(0, 50)}...`
          );
        } else if (part.type === "image") {
          console.log(`    Part ${partIndex} (Image):`);
          if (typeof part.image === "string") {
            console.log(`      Data: ${part.image.substring(0, 50)}...`);
          } else if (part.image instanceof URL) {
            console.log(`      URL: ${part.image.toString()}`);
          } else {
            console.log(`      Data: [${part.image.constructor.name}]`);
          }
          if (part.mimeType) {
            console.log(`      MIME Type: ${part.mimeType}`);
          }
        }
      });
    }

    if (msg.role === "tool") {
      console.log(`  Tool Name: ${msg.content}`);
    }
  });

  return new Response(JSON.stringify(coreMessages), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
