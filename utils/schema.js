import { z } from "zod";

export const configSchema = z.object({
    port: z.number().optional(),
    allowed_origins: z.array(z.string()).default([]),
    services: z.array(
        z.object({
            route: z.string(),
            endpoint: z.url(),
        }),
    ),
});
