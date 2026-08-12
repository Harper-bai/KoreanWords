/**
 * [INPUT]: Next.js 动态路由 params.bookId，依赖 booksMeta 与 booksVocab
 * [OUTPUT]: 练习范围+模式选择页，注入数据给 PracticeChooseClient 渲染
 * [POS]: practice/[bookId]/choose/ 的 Server Component，向客户端子组件注入书籍与课次数据
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import TopNav from "@/components/layout/TopNav";
import { getBooksMeta } from "@/lib/data/booksMeta";
import { getAllVocab } from "@/lib/data/booksVocab";
import PracticeChooseClient from "./PracticeChooseClient";

export default async function PracticeChoosePage({
  params,
}: {
  params: { bookId: string } | Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;
  const normalizedBookId = bookId.trim();
  const books = getBooksMeta();
  const book = books.find((b) => b.id === normalizedBookId);

  if (!book || book.status !== "ready") {
    return (
      <div className="min-h-screen bg-zinc-50">
        <TopNav />
        <main className="mx-auto w-full max-w-4xl px-4 pb-16 pt-10">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="text-lg font-semibold text-zinc-900">{book?.title ?? "未知书籍"}</div>
            <div className="mt-2 text-sm text-zinc-600">该书数据尚未就绪，练习功能暂不可用。</div>
          </div>
        </main>
      </div>
    );
  }

  // 服务端预计算各课词数（避免客户端再加载全量词库）
  const vocab = getAllVocab(normalizedBookId);
  const wordCountByLesson: Record<string, number> = {};
  for (const it of vocab) {
    wordCountByLesson[it.lessonId] = (wordCountByLesson[it.lessonId] ?? 0) + 1;
  }

  const lessonMetas =
    book.lessons && book.lessons.length > 0
      ? book.lessons
      : Object.keys(wordCountByLesson)
          .sort()
          .map((id) => ({ id, title: id }));

  return (
    <div className="min-h-screen bg-zinc-50">
      <TopNav />
      <main className="mx-auto w-full max-w-4xl px-4 pb-16 pt-10">
        <PracticeChooseClient
          bookId={normalizedBookId}
          bookTitle={book.title}
          lessonMetas={lessonMetas}
          wordCountByLesson={wordCountByLesson}
        />
      </main>
    </div>
  );
}
