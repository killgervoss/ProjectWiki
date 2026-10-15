import type { CollectionEntry } from 'astro:content';
import { defaultLang, languages, topicPath, type Lang } from '../i18n/ui';

export type Topic = CollectionEntry<'topics'>;
export type TranslationLinks = Partial<Record<Lang, string>>;
const lookupKey = (lang: Lang, key: string) => `${lang}:${key}`;

export function createTopicRegistry(entries: Topic[]) {
  const all = new Map<string, Topic>();
  for (const topic of entries) {
    const key = lookupKey(topic.data.lang, topic.data.topicKey);
    if (all.has(key)) throw new Error(`Duplicate topic translation "${key}". Each topicKey can have only one entry per language.`);
    all.set(key, topic);
  }
  const published = entries.filter(topic => !topic.data.draft);
  const byLanguageAndKey = new Map(published.map(topic => [lookupKey(topic.data.lang, topic.data.topicKey), topic]));
  const byConcept = new Map<string, Map<Lang, Topic>>();
  for (const topic of published) {
    const translations = byConcept.get(topic.data.topicKey) ?? new Map<Lang, Topic>();
    translations.set(topic.data.lang, topic);
    byConcept.set(topic.data.topicKey, translations);
  }

  function resolveRelated(topic: Topic): Topic[] {
    return [...new Set(topic.data.relatedTopics)].map(key => {
      const translations = byConcept.get(key);
      const target = translations?.get(topic.data.lang) ?? translations?.get(defaultLang) ?? translations?.values().next().value;
      if (!target) {
        const caseMatch = [...byConcept.keys()].find(candidate => candidate.toLowerCase() === key.toLowerCase());
        const isDraft = entries.some(entry => entry.data.topicKey === key && entry.data.draft);
        const hint = caseMatch ? ` Did you mean "${caseMatch}"?` : isDraft ? ' The available target is marked draft: true.' : ' Add a published topic with that topicKey or remove the reference.';
        throw new Error(`${topic.filePath ?? topic.id}: related topicKey "${key}" is missing or unpublished.${hint}`);
      }
      return target;
    });
  }
  // Validate every published entry, even when it is not on the current directory page.
  for (const topic of published) resolveRelated(topic);

  function translationLinks(topic: Topic): TranslationLinks {
    return Object.fromEntries(languages.flatMap(lang => {
      const target = byLanguageAndKey.get(lookupKey(lang, topic.data.topicKey));
      return target ? [[lang, topicPath(lang, target.data.topicKey)]] : [];
    }));
  }
  return { published, resolveRelated, translationLinks };
}
