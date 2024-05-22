import { z } from 'zod';

export const evoWebhookResponseSchema = z.object({
  IdW12: z.number(),
  IdBranch: z.number(),
  IdRecord: z.number(),
  EventType: z.string(),
});

export type EvoWebhook = z.infer<typeof evoWebhookResponseSchema>;
