import { type CoreMessage, type TextPart, type ImagePart } from "ai";
import { CoreCompatibleMessage } from "@/types";

type Attachment = NonNullable<
  CoreCompatibleMessage["experimental_attachments"]
>[number];
type ToolResult = NonNullable<CoreCompatibleMessage["toolInvocations"]>[number];
type InputMessages = Array<{
  role: "user" | "assistant" | "system";
  content: string;
  toolInvocations?: Array<ToolResult>;
  experimental_attachments?: Attachment[];
}>;
type MessageRole = "system" | "assistant" | "user";
type AttachmentContent = Array<TextPart | ImagePart>;

export function copyConvertToCoreMessages(
  messages: InputMessages
): CoreMessage[] {
  if (!Array.isArray(messages)) {
    throw new TypeError("Input must be an array of messages");
  }

  return messages.map((message, index): CoreMessage => {
    if (!isValidMessage(message)) {
      throw new TypeError(`Invalid message at index ${index}`);
    }

    const { role, content, experimental_attachments } = message;

    if (role === "user" && experimental_attachments?.length) {
      return {
        role,
        content: processUserMessageWithAttachments(
          content,
          experimental_attachments
        ),
      };
    }

    return { role, content: content ?? "" };
  });
}

function isValidMessage(
  message: any
): message is { role: MessageRole; content?: string } {
  return (
    typeof message === "object" &&
    message !== null &&
    "role" in message &&
    typeof message.role === "string"
  );
}

function processUserMessageWithAttachments(
  content: string | undefined,
  attachments: Attachment[]
): AttachmentContent {
  const result: AttachmentContent = [{ type: "text", text: content ?? "" }];

  attachments.forEach((attachment, index) => {
    if (attachment?.contentType?.startsWith("image/")) {
      try {
        result.push({
          type: "image",
          image: base64ToUint8Array(attachment.url),
          mimeType: attachment.contentType,
        });
      } catch (error) {
        console.error(`Error processing attachment ${index}:`, error);
      }
    }
  });

  return result;
}

/**
 * 将 base64 字符串转换为 Uint8Array
 * @param base64 - 要转换的 base64 字符串
 * @returns 转换后的 Uint8Array
 * @throws 如果转换失败则抛出错误
 */
export function base64ToUint8Array(base64: string): Uint8Array {
  try {
    // 处理可能的 MIME 类型前缀
    const base64String = base64.split(",").pop() || "";

    // 处理 URL 安全的 base64
    const standardBase64 = base64String.replace(/-/g, "+").replace(/_/g, "/");

    const binaryString = atob(standardBase64);
    return Uint8Array.from(binaryString, (char) => char.charCodeAt(0));
  } catch (error) {
    console.error("Error in base64ToUint8Array:", error);
    throw new Error(
      `Failed to convert base64 to Uint8Array: ${(error as Error).message}`
    );
  }
}

// function base64ToUint8Array(base64: string): Uint8Array {
//   const base64Chars =
//     'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

//   function decode(encoded: string): string {
//     let decoded = '';
//     encoded = encoded.replace(/[^A-Za-z0-9+/]/g, '');
//     for (let i = 0; i < encoded.length; i += 4) {
//       const v =
//         (base64Chars.indexOf(encoded[i]) << 18) |
//         (base64Chars.indexOf(encoded[i + 1]) << 12) |
//         (base64Chars.indexOf(encoded[i + 2]) << 6) |
//         base64Chars.indexOf(encoded[i + 3]);
//       decoded += String.fromCharCode((v >> 16) & 255, (v >> 8) & 255, v & 255);
//     }
//     return decoded;
//   }

//   try {
//     const parts = base64.split(',');
//     if (parts.length !== 2) {
//       throw new Error('Invalid base64 string format');
//     }
//     const binaryString = decode(parts[1]);
//     const bytes = new Uint8Array(binaryString.length);
//     for (let i = 0; i < binaryString.length; i++) {
//       bytes[i] = binaryString.charCodeAt(i);
//     }
//     return bytes;
//   } catch (error) {
//     console.error('Error in base64ToUint8Array:', error);
//     throw new Error(
//       `Failed to convert base64 to Uint8Array: ${(error as Error).message}`
//     );
//   }
// }
