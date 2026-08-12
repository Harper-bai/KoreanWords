import Link from "next/link";
import TopNav from "@/components/layout/TopNav";
import { getBooksMeta } from "@/lib/data/booksMeta";
import { getLessonIds } from "@/lib/data/booksVocab";

const LESSON_LABELS: Record<string, string> = {
  "lesson-01": "第1课",
  "lesson-02": "第2课",
  "lesson-03": "第3课",
  "lesson-04": "第4课",
  "lesson-05": "第5课",
  "lesson-06": "第6课",
  "lesson-07": "第7课",
  "lesson-08": "第8课",
  "lesson-09": "第9课",
  "lesson-10": "第10课",
};

export default async function BookDetailPage({
  params,
}: {
  params: { bookId: string } | Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;
  const normalizedBookId = bookId.trim();

  const books = getBooksMeta();
  const book = books.find((b) => b.id === normalizedBookId);
  const lessonIds = getLessonIds(normalizedBookId);

  // 优先使用 meta 里的 lessons 列表（含课名），否则降级到 lessonIds
  const lessons =
    book?.lessons ??
    lessonIds.map((id) => ({ id, title: "" }));

  return (
    <div className="min-h-screen bg-zinc-50">
      <TopNav />
      <main className="mx-auto w-full max-w-4xl px-4 pb-16 pt-10">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-bold text-zinc-900">{book?.title ?? "未知书籍"}</h1>
          <p className="mt-1 text-sm text-zinc-600">
            {book?.status === "ready"
              ? `选择一课开始练习（共 ${lessons.length} 课）`
              : "该书数据尚未就绪，暂时无法练习。"}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {book?.status === "ready" &&
              lessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  href={`/books/${normalizedBookId}/lessons/${lesson.id}`}
                  className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 hover:bg-white transition-colors"
                >
                  <span className="shrink-0 rounded-lg bg-zinc-900 px-2.5 py-1 text-xs font-bold text-white">
                    {LESSON_LABELS[lesson.id] ?? lesson.id}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-zinc-900">{lesson.title}</div>
                    <div className="mt-0.5 text-xs text-zinc-500">查看词表与练习</div>
                  </div>
                </Link>
              ))}
          </div>

          {book?.status !== "ready" && (
            <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
              Coming Soon：后续补齐数据后即可使用。
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

