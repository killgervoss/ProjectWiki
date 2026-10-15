import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const topics = defineCollection({
  loader: glob({
    base: './src/content/topics',
    pattern: '**/*.{md,mdx}',
  }),
  schema: z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    category: z.string().min(1),
    aliases: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    sources: z.array(z.object({
      book: z.string().min(1),
      author: z.string().min(1),
      chapter: z.string().min(1),
      pages: z.string().optional(),
    })).min(1),
    relatedTopics: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { topics };
