import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const DEFAULT_JWT_FALLBACK = "aimers_dev_secret_change_me";

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  CLIENT_URL: z.string().default("http://localhost:3000"),
  MONGODB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default("7d"),
  GOOGLE_CLIENT_ID: z.string().optional().default(""),
  GOOGLE_CLIENT_SECRET: z.string().optional().default(""),
  AI_PROVIDER: z.enum(["openai", "gemini"]).default("openai"),
  OPENAI_API_KEY: z.string().optional().default(""),
  GEMINI_API_KEY: z.string().optional().default(""),
  DEMO_EMAIL: z.string().email().default("demo@aimers.com"),
  DEMO_PASSWORD: z.string().default("Demo@1234"),
});

const parsed = envSchema.safeParse(process.env);
const nodeEnv =
  (process.env.NODE_ENV as "development" | "production" | "test") ||
  "development";

if (!parsed.success) {
  console.error(
    "Invalid environment variables:",
    parsed.error.flatten().fieldErrors
  );
  if (nodeEnv === "production") {
    process.exit(1);
  }
}

const jwtSecret =
  process.env.JWT_SECRET ||
  (nodeEnv === "production" ? "" : DEFAULT_JWT_FALLBACK);

if (!jwtSecret || (nodeEnv === "production" && jwtSecret === DEFAULT_JWT_FALLBACK)) {
  console.error(
    "JWT_SECRET must be set to a strong unique value in production."
  );
  process.exit(1);
}

if (nodeEnv === "production" && !process.env.MONGODB_URI) {
  console.error("MONGODB_URI is required in production.");
  process.exit(1);
}

const clientUrl = (process.env.CLIENT_URL || "http://localhost:3000").replace(
  /\/$/,
  ""
);

if (
  nodeEnv === "production" &&
  (!process.env.CLIENT_URL ||
    clientUrl.includes("localhost") ||
    clientUrl.includes("127.0.0.1"))
) {
  console.warn(
    "Warning: set CLIENT_URL to your production frontend origin (not localhost) for CORS."
  );
}

export const env = {
  PORT: Number(process.env.PORT) || 5000,
  NODE_ENV: nodeEnv,
  CLIENT_URL: clientUrl,
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/aimers",
  JWT_SECRET: jwtSecret,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  AI_PROVIDER: (process.env.AI_PROVIDER as "openai" | "gemini") || "openai",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  DEMO_EMAIL: process.env.DEMO_EMAIL || "demo@aimers.com",
  DEMO_PASSWORD: process.env.DEMO_PASSWORD || "Demo@1234",
};
