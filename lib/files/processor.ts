import { getEnv } from "@/lib/config/env";
import { ConfigurationError } from "@/lib/errors/app-error";

export type ProcessedFileResult = {
  processor: "external" | "mock";
  extractedText: string;
  rawResponse: unknown;
};

type ExternalProcessorResponse = {
  text?: string;
  extractedText?: string;
  content?: string;
  summary?: string;
  [key: string]: unknown;
};

function getTextFromProcessorResponse(payload: ExternalProcessorResponse) {
  return payload.extractedText ?? payload.text ?? payload.content ?? payload.summary ?? JSON.stringify(payload);
}

function getMockProcessedText(file: File) {
  return [
    `Mock processed file: ${file.name}`,
    `Type: ${file.type}`,
    `Size: ${file.size} bytes`,
    "External processor is not configured. This local mock confirms upload, ownership checks, and database persistence.",
  ].join("\n");
}

export async function processFileWithExternalApi(file: File, requestId: string): Promise<ProcessedFileResult> {
  const env = getEnv();

  if (!env.EXTERNAL_PROCESSOR_API_URL) {
    if (!env.MOCK_FILE_PROCESSING) {
      throw new ConfigurationError("EXTERNAL_PROCESSOR_API_URL is not configured.");
    }

    return {
      processor: "mock",
      extractedText: getMockProcessedText(file),
      rawResponse: {
        requestId,
        mode: "mock",
        fileName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
      },
    };
  }

  const formData = new FormData();
  formData.append("file", file, file.name);
  formData.append("requestId", requestId);

  const response = await fetch(env.EXTERNAL_PROCESSOR_API_URL, {
    method: "POST",
    headers: env.EXTERNAL_PROCESSOR_API_KEY
      ? {
          Authorization: `Bearer ${env.EXTERNAL_PROCESSOR_API_KEY}`,
        }
      : undefined,
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`External processor failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as ExternalProcessorResponse;

  return {
    processor: "external",
    extractedText: getTextFromProcessorResponse(payload),
    rawResponse: payload,
  };
}
