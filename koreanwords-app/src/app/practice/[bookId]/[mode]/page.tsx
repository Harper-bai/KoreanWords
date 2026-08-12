/**
 * [INPUT]: params.bookId + params.mode，searchParams.lessonIds（逗号分隔的课 id 列表）
 * [OUTPUT]: 渲染 PracticeModeClient，注入对应课次的词汇列表与范围标签
 * [POS]: practice/[bookId]/[mode]/ 的 Server Component，是实际练习的入口页
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import type { ModeId } from "@/lib/storage/stats";
import { getBooksMeta } from "@/lib/data/booksMeta";
import { getAllVocab, getVocabForLesson } from "@/lib/data/booksVocab";
import PracticeModeClient from "@/components/practice/PracticeModeClient";
import TopNav from "@/components/layout/TopNav";
import Link from "next/link";

const ALLOWED_MODES: ModeId[] = ["cn2kr", "kr2cn", "mcq"];

const MODE_LABELS: Record<string, string> = {
  cn2kr: "中 → 韩（默写）",
  kr2cn: "韩 → 中（默写）",
  mcq: "韩 → 中（选择）",
};

export default async function PracticeModePage({
  params,
  searchParams,
}: {
  params: { bookId: string; mode: string } | Promise<{ bookId: string; mode: string }>;
  searchParams?: { lessonIds?: string; lessonId?: string };
}) {
  const resolved = await params;
  const normalizedBookId = resolved.bookId.trim();
  const mode = resolved.mode as ModeId;

  const books = getBooksMeta();
  const book = books.find((b) => b.id === normalizedBookId);

  if (!book || book.status !== "ready" || !ALLOWED_MODES.includes(mode)) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <TopNav />
        <main className="mx-auto w-full max-w-4xl px-4 pb-16 pt-10">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            无法开始练习：书籍未就绪或模式不支持。
          </div>
        </main>
      </div>
    );
  }

  // 解析 lessonIds（新格式，逗号分隔）或兼容旧的单个 lessonId
  const rawLessonIds =
    typeof searchParams?.lessonIds === "string"
      ? searchParams.lessonIds
          .split(",")
          .map((s) => decodeURIComponent(s).trim())
          .filter(Boolean)
      : typeof searchParams?.lessonId === "string"
        ? [searchParams.lessonId.trim()]
        : [];

  const vocab =
    rawLessonIds.length === 0
      ? getAllVocab(normalizedBookId)
      : rawLessonIds.length === 1
        ? getVocabForLesson(normalizedBookId, rawLessonIds[0])
        : rawLessonIds.flatMap((id) => getVocabForLesson(normalizedBookId, id));

  // 构建范围标签（用于顶部展示）
  const rangeLabel =
    rawLessonIds.length === 0
      ? "全部词汇"
      : rawLessonIds
          .map((id) => book.lessons?.find((l) => l.id === id)?.title ?? id)
          .join("、");

  return (
    <div className="min-h-screen bg-zinc-50">
      <TopNav />
      <main className="mx-auto w-full max-w-4xl px-4 pb-16 pt-6">
        {/* 面包屑 + 范围说明 */}
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-zinc-500">
            <Link
              href={`/practice/${normalizedBookId}/choose`}
              className="hover:text-zinc-900 underline underline-offset-2"
            >
              {book.title}
            </Link>
            <span className="mx-1.5">›</span>
            <span className="text-zinc-700 font-medium">{MODE_LABELS[mode] ?? mode}</span>
          </div>
          <div className="text-xs text-zinc-400 text-right">
            范围：{rangeLabel} · {vocab.length} 词
          </div>
        </div>

        <PracticeModeClient bookId={normalizedBookId} mode={mode} vocab={vocab} />
      </main>
    </div>
  );
}
