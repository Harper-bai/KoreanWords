import Link from "next/link";
import { getBooksMeta } from "@/lib/data/booksMeta";

/**
 * [INPUT]: 依赖书籍元数据（getBooksMeta）用于渲染可练习入口
 * [OUTPUT]: 对外提供全站顶部导航（词书/词表/统计/练习入口），供页面布局直接消费
 * [POS]: components/layout/TopNav，作为全局导航被各页面引入
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
export default function TopNav() {
  const books = getBooksMeta();

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-zinc-50/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-sm font-semibold text-zinc-900">
          KoreanWords
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          <Link href="/books" className="text-zinc-700 hover:text-zinc-900">
            词书
          </Link>
          <Link href="/vocab/yonsei-1" className="text-zinc-700 hover:text-zinc-900">
            词表
          </Link>
          <Link href="/stats" className="text-zinc-700 hover:text-zinc-900">
            统计
          </Link>
          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-zinc-500">练习：</span>
            {books
              .filter((b) => b.status === "ready")
              .map((b) => (
                <Link
                  key={b.id}
                  href={`/practice/${b.id}/choose`}
                  className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-900 hover:bg-zinc-50"
                >
                  {b.id.replace("yonsei-", "韩语")}
                </Link>
              ))}
          </div>
        </nav>
      </div>
    </header>
  );
}

