import { CoreCompatibleMessage, CoreMessageRole } from "@/types";
import { Message, type ToolInvocation } from "ai";
import { copyConvertToCoreMessages } from "./copy-convert-messages";

type GenericToolResult = Extract<ToolInvocation, { state: "result" }>;
/**
 * 检查给定的角色是否为有效的 CoreMessageRole
 * @param role - 要检查的角色
 * @returns 如果角色有效则返回 true，否则返回 false
 */
export function isCoreMessageRole(
  role: Message["role"]
): role is CoreMessageRole {
  return ["system", "user", "assistant"].includes(role);
}

/**
 * 检查给定的工具调用是否为工具结果
 * @param invocation - 要检查的工具调用
 * @returns 如果是工具结果则返回 true，否则返回 false
 */
function isToolResult(
  invocation: ToolInvocation
): invocation is GenericToolResult {
  return invocation.state === "result";
}

/**
 * 将单个 Message 对象转换为 CoreCompatibleMessage
 * @param message - 要转换的 Message 对象
 * @returns 转换后的 CoreCompatibleMessage 对象
 * @throws 如果消息角色无效则抛出错误
 */
export function convertToCoreCompatibleMessage(
  message: Message
): CoreCompatibleMessage {
  if (!isCoreMessageRole(message.role)) {
    throw new Error(
      `Invalid message role "${message.role}". Expected "system", "user", or "assistant".`
    );
  }

  const toolInvocations = message.toolInvocations?.filter(isToolResult);

  return {
    role: message.role,
    content: message.content,
    toolInvocations: toolInvocations,
    experimental_attachments: message.experimental_attachments,
  };
}

/**
 * 将 Message 数组转换为 CoreCompatibleMessage 数组
 * @param messages - 要转换的 Message 数组
 * @returns 转换后的 CoreCompatibleMessage 数组
 * @throws 如果任何消息转换失败则抛出错误
 */
export function prepareCoreMessages(
  messages: Message[]
): CoreCompatibleMessage[] {
  return messages.map((message, index) => {
    try {
      return convertToCoreCompatibleMessage(message);
    } catch (error) {
      throw new Error(
        `Error converting message at index ${index}: ${
          (error as Error).message
        }`
      );
    }
  });
}

/**
 * 将 Message 数组转换为 CoreMessage 数组
 * @param messages - 要转换的 Message 数组
 * @returns 转换后的 CoreMessage 数组
 * @throws 如果转换过程中出现错误则抛出异常
 */
export function convertMessagesToCoreMessages(messages: Message[]) {
  try {
    console.log(
      "Original messages:",
      JSON.stringify(
        messages,
        (key, value) => {
          if (key === "experimental_attachments" && Array.isArray(value)) {
            return value.map((attachment) => ({
              ...attachment,
              url: attachment.url.substring(0, 100) + "...",
            }));
          }
          return value;
        },
        2
      )
    );

    const compatibleMessages = prepareCoreMessages(messages);

    console.log(
      "Compatible messages:",
      JSON.stringify(
        compatibleMessages,
        (key, value) => {
          if (key === "experimental_attachments" && Array.isArray(value)) {
            return value.map((attachment) => ({
              ...attachment,
              url: attachment.url.substring(0, 100) + "...",
            }));
          }
          return value;
        },
        2
      )
    );

    // 比较 experimental_attachments
    messages.forEach((msg, index) => {
      if (msg.experimental_attachments) {
        console.log(
          `Message ${index} attachments:`,
          msg.experimental_attachments.map((att) => ({
            name: att.name,
            contentType: att.contentType,
            urlLength: att.url.length,
            urlType: typeof att.url,
          }))
        );
      }
    });

    compatibleMessages.forEach((msg, index) => {
      if (msg.experimental_attachments) {
        console.log(
          `Compatible message ${index} attachments:`,
          msg.experimental_attachments.map((att) => ({
            name: att.name,
            contentType: att.contentType,
            urlLength: att.url.length,
            urlType: typeof att.url,
          }))
        );
      }
    });

    return copyConvertToCoreMessages(compatibleMessages);
  } catch (error) {
    console.error("Error details:", error);
    throw new Error(
      `Error converting messages to core messages: ${(error as Error).message}`
    );
  }
}
