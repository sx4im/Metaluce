import { z } from "zod";
import { analyses, insertAnalysisSchema, actionItemSchema, analyzeRequestSchema } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  analyze: {
    process: {
      method: "POST" as const,
      path: "/api/analyze",
      input: analyzeRequestSchema,
      responses: {
        200: z.custom<typeof analyses.$inferSelect>(), 
        400: errorSchemas.validation,
      },
    },
    list: {
      method: "GET" as const,
      path: "/api/analyses",
      responses: {
        200: z.array(z.custom<typeof analyses.$inferSelect>()),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/analyses/:id",
      responses: {
        200: z.custom<typeof analyses.$inferSelect>(),
        404: errorSchemas.notFound,
      }
    }
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
