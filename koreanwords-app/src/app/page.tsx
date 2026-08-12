import Link from "next/link";
import TopNav from "@/components/layout/TopNav";
import { getBooksMeta } from "@/lib/data/booksMeta";

export default function Home() {
  const books = getBooksMeta();
  const yonsei1 = books.find((b) => b.id === "yonsei-1");

  return (
    <div className="min-h-screen bg-zinc-50">
      <TopNav />
      <main className="mx-auto w-full max-w-4xl px-4 pb-16 pt-10">
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">KoreanWords</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            简洁的延世韩国语词汇学习工具站：多模式练习、词表浏览检索、以及本地学习进度统计。
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={yonsei1 ? `/books/${yonsei1.id}` : "/books"}
              className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              进入词书
            </Link>
            <Link
              href={yonsei1 ? `/practice/${yonsei1.id}/choose` : "/practice/yonsei-1/choose"}
              className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              立即练习（韩语1）
            </Link>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-base font-semibold text-zinc-900">词书入口</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {books.map((book) => (
              <Link
                key={book.id}
                href={`/books/${book.id}`}
                className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm hover:bg-zinc-50"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-zinc-900">{book.title}</div>
                    <div className="mt-1 text-xs text-zinc-500">Level {book.level}</div>
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
        </section>
      </main>
    </div>
  );
}

