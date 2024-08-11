import { convertToCoreMessages } from "ai";

export type CoreCompatibleMessage = Parameters<
  typeof convertToCoreMessages
>[0][number];

export type CoreMessageRole = CoreCompatibleMessage["role"];
