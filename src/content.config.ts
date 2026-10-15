import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const topicKey = z.string().regex(
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  'Use a stable lowercase key such as "soyombo-useg"; no language prefix or extension.',
);

const topics = defineCollection({
  loader: glob({ base: './src/content/topics', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    topicKey,
    lang: z.enum(['mn', 'en']),
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
    relatedTopics: z.array(topicKey).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { topics };
