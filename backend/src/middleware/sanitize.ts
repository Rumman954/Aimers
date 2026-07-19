import type { RequestHandler } from "express";
import hpp from "hpp";
import xss from "xss";

/** Strip Mongo operator-like keys ($ and dotted paths). */
function stripMongoKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stripMongoKeys);
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(
      value as Record<string, unknown>
    )) {
      if (key.startsWith("$") || key.includes(".")) continue;
      out[key] = stripMongoKeys(nested);
    }
    return out;
  }
  return value;
}

/** Recursively sanitize string values against XSS. */
function sanitizeValue(value: unknown): unknown {
  if (typeof value === "string") {
    return xss(value, {
      whiteList: {},
      stripIgnoreTag: true,
      stripIgnoreTagBody: ["script", "style"],
    });
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(
      value as Record<string, unknown>
    )) {
      out[key] = sanitizeValue(nested);
    }
    return out;
  }
  return value;
}

/**
 * Express 5-safe sanitizer (req.query is a getter-only property,
 * so packages that reassign req.query will crash).
 */
export const sanitizeInput: RequestHandler = (req, _res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeValue(stripMongoKeys(req.body)) as typeof req.body;
  }

  if (req.params && typeof req.params === "object") {
    const cleaned = sanitizeValue(stripMongoKeys(req.params)) as Record<
      string,
      string
    >;
    for (const key of Object.keys(req.params)) {
      delete req.params[key];
    }
    Object.assign(req.params, cleaned);
  }

  if (req.query && typeof req.query === "object") {
    const cleaned = sanitizeValue(stripMongoKeys(req.query)) as Record<
      string,
      unknown
    >;
    for (const key of Object.keys(req.query)) {
      delete (req.query as Record<string, unknown>)[key];
    }
    Object.assign(req.query, cleaned);
  }

  next();
};

export const hppMiddleware = hpp({
  whitelist: [
    "category",
    "level",
    "sort",
    "page",
    "limit",
    "minPrice",
    "maxPrice",
    "minRating",
    "search",
  ],
});
