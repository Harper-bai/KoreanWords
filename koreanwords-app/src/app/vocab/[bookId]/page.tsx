import TopNav from "@/components/layout/TopNav";
import { getBooksMeta } from "@/lib/data/booksMeta";
import type { VocabItem } from "@/lib/data/booksVocab";
import { getAllVocab } from "@/lib/data/booksVocab";
import { getLessonIds } from "@/lib/data/booksVocab";

function normalizeQuery(s: string): string {
  return s.replace(/\s+/g, "").trim().toLowerCase();
}

export default async function VocabSearchPage({
  params,
  searchParams,
}: {
  params: { bookId: string } | Promise<{ bookId: string }>;
  searchParams?: { q?: string; lessonId?: string };
}) {
  const resolvedParams = await params;
  const normalizedBookId = resolvedParams.bookId.trim();
  const q = typeof searchParams?.q === "string" ? searchParams.q : "";
  const selectedLessonIdFromUrl = typeof searchParams?.lessonId === "string" ? searchParams.lessonId : "";

  const lessonIds = getLessonIds(normalizedBookId);
  const vocab = getAllVocab(normalizedBookId);
  const books = getBooksMeta();
  const book = books.find((b) => b.id === normalizedBookId);
  const lessonMetas =
    book?.lessons && book.lessons.length > 0
      ? book.lessons
      : lessonIds.map((id) => ({ id, title: id }));

  const nq = normalizeQuery(q);
  const lessonFilter = selectedLessonIdFromUrl ? selectedLessonIdFromUrl : null;

  const filtered: VocabItem[] = vocab.filter((it) => {
    if (lessonFilter && it.lessonId !== lessonFilter) return false;
    if (!nq) return true;
    const hayK = normalizeQuery(it.korean);
    const hayC = normalizeQuery(it.chinese);
    return hayK.includes(nq) || hayC.includes(nq);
  });

  const showList = filtered.slice(0, 300);

  return (
    <div className="min-h-screen bg-zinc-50">
      <TopNav />
      <main className="mx-auto w-full max-w-4xl px-4 pb-16 pt-10">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h1 className="text-lg font-bold text-zinc-900">词表检索 - {normalizedBookId}</h1>
          <p className="mt-1 text-sm text-zinc-600">支持中文/韩文关键词模糊检索，支持按课过滤。</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <input
              defaultValue={q}
              placeholder="输入关键词（韩文或中文）"
              className="sm:col-span-2 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500"
            />

            <form
              method="GET"
              action={`/vocab/${normalizedBookId}`}
              className="sm:col-span-1"
            >
              <input type="hidden" name="q" value={q} />
              <select
                name="lessonId"
                defaultValue={selectedLessonIdFromUrl}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm"
              >
                <option value="">全部课</option>
                {lessonMetas.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title}（{l.id}）
                  </option>
                ))}
              </select>
              <button type="submit" className="mt-2 w-full rounded-xl bg-zinc-900 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-800">
                筛选
              </button>
            </form>
          </div>

          <div className="mt-4 text-sm text-zinc-600">匹配结果：{filtered.length}（展示前 {showList.length}）</div>

          <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
                <tr>
                  <th className="px-4 py-3">韩文</th>
                  <th className="px-4 py-3">中文</th>
                  <th className="px-4 py-3">课</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {showList.map((it: VocabItem) => (
                  <tr key={it.id} className="hover:bg-white/60">
                    <td className="px-4 py-2 font-semibold text-zinc-900">{it.korean}</td>
                    <td className="px-4 py-2 text-zinc-700">{it.chinese}</td>
                    <td className="px-4 py-2 text-zinc-500 text-xs">{it.lessonId}</td>
                  </tr>
                ))}
                {showList.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-sm text-zinc-500">
                      没有匹配结果
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

