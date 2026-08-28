type LogLevel = "info" | "warn" | "error";

type LogFields = {
  requestId?: string;
  userId?: string;
  conversationId?: string;
  agentRunId?: string;
  event: string;
  duration?: number;
  status?: string;
  errorType?: string;
  error?: unknown;
};

function redact(value: unknown) {
  if (value instanceof Error) {
    return { name: value.name, message: value.message };
  }

  return value;
}

function write(level: LogLevel, fields: LogFields) {
  const { error, ...rest } = fields;
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    ...rest,
    ...(error ? { error: redact(error) } : {}),
  };

  const line = JSON.stringify(payload);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  info: (fields: LogFields) => write("info", fields),
  warn: (fields: LogFields) => write("warn", fields),
  error: (fields: LogFields) => write("error", fields),
};
