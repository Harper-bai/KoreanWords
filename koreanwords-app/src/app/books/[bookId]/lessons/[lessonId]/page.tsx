import Link from "next/link";
import TopNav from "@/components/layout/TopNav";
import { getBooksMeta } from "@/lib/data/booksMeta";
import { getVocabForLesson } from "@/lib/data/booksVocab";

export default async function LessonDetailPage({
  params,
}: {
  params:
    | { bookId: string; lessonId: string }
    | Promise<{ bookId: string; lessonId: string }>;
}) {
  const { bookId, lessonId } = await params;
  const normalizedBookId = bookId.trim();
  const books = getBooksMeta();
  const book = books.find((b) => b.id === normalizedBookId);
  const lessonMeta = book?.lessons?.find((l) => l.id === lessonId);
  const vocab = getVocabForLesson(normalizedBookId, lessonId);

  return (
    <div className="min-h-screen bg-zinc-50">
      <TopNav />
      <main className="mx-auto w-full max-w-4xl px-4 pb-16 pt-10">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-zinc-900 px-2.5 py-1 text-xs font-bold text-white">
              {lessonId.replace("lesson-0", "第").replace("lesson-", "第").replace(/(\d+)$/, "$1课")}
            </span>
            <h1 className="text-lg font-bold text-zinc-900">
              {lessonMeta?.title ? `${lessonMeta.title}` : lessonId}
            </h1>
          </div>
          <p className="mt-1 text-sm text-zinc-500">
            {book?.title} · 共 {vocab.length} 个词汇
          </p>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
            <Link
              href={`/practice/${bookId}/choose?lessonId=${encodeURIComponent(lessonId)}`}
              className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              开始练习
            </Link>
            <Link
              href={`/vocab/${bookId}?lessonId=${encodeURIComponent(lessonId)}`}
              className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              进入词表检索
            </Link>
          </div>

          <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
                <tr>
                  <th className="px-4 py-3">韩文</th>
                  <th className="px-4 py-3">中文</th>
                  <th className="px-4 py-3">词性</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {vocab.slice(0, 120).map((it) => (
                  <tr key={it.id} className="hover:bg-white/60">
                    <td className="px-4 py-2 font-semibold text-zinc-900">{it.korean}</td>
                    <td className="px-4 py-2 text-zinc-700">{it.chinese}</td>
                    <td className="px-4 py-2 text-zinc-500">{it.pos ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {vocab.length > 120 ? (
            <div className="mt-3 text-xs text-zinc-500">本页仅展示前 120 条；更多内容在词表检索页。</div>
          ) : null}
        </div>
      </main>
    </div>
  );
}

