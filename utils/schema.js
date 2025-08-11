import { z } from 'zod'

export const configSchema = z.object({
	port: z.number().optional(),
	services: z.array(z.object({
		route: z.string(),
		endpoint: z.url()
	}))
})
