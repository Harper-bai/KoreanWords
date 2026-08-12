import Link from "next/link";
import TopNav from "@/components/layout/TopNav";
import { getBooksMeta } from "@/lib/data/booksMeta";

export default function BooksPage() {
  const books = getBooksMeta();

  return (
    <div className="min-h-screen bg-zinc-50">
      <TopNav />
      <main className="mx-auto w-full max-w-4xl px-4 pb-16 pt-10">
        <h1 className="text-xl font-bold text-zinc-900">词书</h1>
        <p className="mt-1 text-sm text-zinc-600">选择一本书开始练习。</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {books.map((book) => (
            <Link
              key={book.id}
              href={`/books/${book.id}`}
              className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm hover:bg-zinc-50"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-zinc-900">{book.title}</div>
                  <div className="mt-1 text-xs text-zinc-500">
                    {book.status === "ready" ? `共 ${book.lessonCount} 课` : "数据未就绪"}
                  </div>
                </div>
                <div
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    book.status === "ready"
                      ? "border border-emerald-100 bg-emerald-50 text-emerald-700"
                      : "border border-zinc-200 bg-zinc-100 text-zinc-700"
                  }`}
                >
                  {book.status === "ready" ? "可用" : "敬请期待"}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

