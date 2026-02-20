export type ContentType = 'word' | 'phrase';

export interface Content {
  id: string;
  type: ContentType;
  original: string; // The word/phrase in the target language (e.g. Portuguese)
  translation: string; // In the source language (e.g. Spanish)
  pronunciation?: string;
  exampleOriginal?: string;
  exampleTranslation?: string;
  category?: string;
}
