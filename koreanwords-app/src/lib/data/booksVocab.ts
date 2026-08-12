import yonsei1VocabJson from "../../../data/books/yonsei-1.json";
import yonsei2VocabJson from "../../../data/books/yonsei-2.json";
import yonsei3VocabJson from "../../../data/books/yonsei-3.json";
import yonsei4VocabJson from "../../../data/books/yonsei-4.json";

/**
 * [INPUT]: 依赖仓库内 `data/books/yonsei-{1..4}.json`，以及调用方传入的 `bookId/lessonId`
 * [OUTPUT]: 对外提供 `getAllVocab()`、`getLessonIds()`、`getVocabForLesson()`（供路由页面、练习模式与词表检索消费）
 * [POS]: lib/data/booksVocab，作为词库数据访问层，被 `src/app/**` 与 `src/components/**` 消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
type RawVocabItem = {
  id: string;
  bookId: string;
  lessonId: string;
  lessonTitle?: string;
  korean: string;
  chinese: string;
  english?: string;
  pos?: string;
  example?: string;
  tags?: string[];
};

export type VocabItem = {
  id: string;
  bookId: string;
  lessonId: string;
  lessonTitle?: string;
  korean: string;
  chinese: string;
  english?: string;
  pos?: string;
  example?: string;
  tags?: string[];
};

const BOOK_JSON: Record<string, unknown[]> = {
  "yonsei-1": yonsei1VocabJson as unknown[],
  "yonsei-2": yonsei2VocabJson as unknown[],
  "yonsei-3": yonsei3VocabJson as unknown[],
  "yonsei-4": yonsei4VocabJson as unknown[],
};

function normalizePos(pos: unknown): string | undefined {
  if (typeof pos !== "string") return undefined;
  const trimmed = pos.trim();
  if (!trimmed) return undefined;
  return trimmed;
}

function mapRawItems(raw: unknown[]): VocabItem[] {
  return (raw as RawVocabItem[]).map((it) => ({
    id: String(it.id),
    bookId: String(it.bookId),
    lessonId: String(it.lessonId),
    lessonTitle: it.lessonTitle,
    korean: String(it.korean ?? "").trim(),
    chinese: String(it.chinese ?? "").trim(),
    english: it.english ? String(it.english).trim() : undefined,
    pos: normalizePos(it.pos),
  }));
}

export function getAllVocab(bookId: string): VocabItem[] {
  const normalizedBookId = bookId.trim();
  const raw = BOOK_JSON[normalizedBookId];
  if (!raw) return [];
  return mapRawItems(raw);
}

export function getLessonIds(bookId: string): string[] {
  const vocab = getAllVocab(bookId);
  const set = new Set<string>();
  for (const it of vocab) set.add(it.lessonId);
  return Array.from(set).sort();
}

export function getVocabForLesson(bookId: string, lessonId: string): VocabItem[] {
  const vocab = getAllVocab(bookId);
  return vocab.filter((it) => it.lessonId === lessonId);
}
