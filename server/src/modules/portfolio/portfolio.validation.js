import { z } from 'zod';

export const createPortfolioSchema = z.object({
  title: z.string().min(1, 'Title required'),
  category: z.enum(['characters', 'creatures', 'environments', 'concepts', 'fanart', 'game-ready']),
  description: z.string().optional().default(''),
  modelEmbedUrl: z.string().optional().default(''),
  tags: z.union([z.string(), z.array(z.string())]).optional().default([]),
  software: z.union([z.string(), z.array(z.string())]).optional().default([]),
  year: z.coerce.number().optional(),
  polyCount: z.string().optional().default(''),
  engine: z.string().optional().default(''),
  isFeatured: z.coerce.boolean().optional().default(false),
  isPublished: z.coerce.boolean().optional().default(true),
});

export const updatePortfolioSchema = createPortfolioSchema.partial();

export const reorderSchema = z.object({
  items: z.array(z.object({ id: z.string(), order: z.number() })),
});
