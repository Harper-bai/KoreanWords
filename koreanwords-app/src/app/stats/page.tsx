"use client";

import { useMemo, useState } from "react";
import TopNav from "@/components/layout/TopNav";
import { getBooksMeta } from "@/lib/data/booksMeta";
import { computeStreakDays, loadStats, saveStats, type StatsState } from "@/lib/storage/stats";

function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function clampPct(n: number): string {
  if (!isFinite(n) || n < 0) return "-";
  return `${Math.round(n * 100)}%`;
}

export default function StatsPage() {
  const books = getBooksMeta();
  const [state, setState] = useState<StatsState>(() => loadStats());

  const todayKey = useMemo(() => toDateKey(new Date()), []);

  const reset = () => {
    const empty: StatsState = { schemaVersion: 1, byBook: {} };
    saveStats(empty);
    setState(empty);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <TopNav />
      <main className="mx-auto w-full max-w-4xl px-4 pb-16 pt-10">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-lg font-bold text-zinc-900">学习统计（本地）</h1>
              <p className="mt-1 text-sm text-zinc-600">练习记录仅保存在你当前浏览器，不做账号体系。</p>
            </div>
            <button
              type="button"
              onClick={reset}
              className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              清空统计
            </button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => {
              const bookStats = state.byBook[book.id];
              const today = bookStats?.byDay?.[todayKey];
              const todayAccuracy = today ? today.correct / Math.max(1, today.total) : 0;
              const streak = bookStats ? computeStreakDays(bookStats.byDay) : 0;

              return (
                <div key={book.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                  <div className="text-sm font-semibold text-zinc-900">{book.title}</div>
                  <div className="mt-2 text-sm text-zinc-700">
                    今日：{today ? `${today.correct}/${today.total}` : "0/0"}（{today ? clampPct(todayAccuracy) : "-" }）
                  </div>
                  <div className="mt-1 text-sm text-zinc-700">连续学习天数：{streak}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <h2 className="text-base font-semibold text-zinc-900">各课完成度（按总答题量）</h2>
            <div className="mt-3 space-y-4">
              {books.map((book) => {
                const byLesson = state.byBook[book.id]?.byLesson ?? {};
                const entries = Object.entries(byLesson).sort((a, b) => (b[1].total ?? 0) - (a[1].total ?? 0));
                if (entries.length === 0) {
                  return (
                    <div key={book.id} className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
                      {book.title}：暂无练习数据
                    </div>
                  );
                }

                return (
                  <div key={book.id} className="rounded-xl border border-zinc-200 bg-white p-4">
                    <div className="text-sm font-semibold text-zinc-900">{book.title}</div>
                    <div className="mt-2 overflow-x-auto">
                      <table className="min-w-full text-left text-sm">
                        <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
                          <tr>
                            <th className="px-4 py-2">课</th>
                            <th className="px-4 py-2">正确/总数</th>
                            <th className="px-4 py-2">正确率</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200">
                          {entries.map(([lessonId, s]) => (
                            <tr key={lessonId} className="hover:bg-white/60">
                              <td className="px-4 py-2 font-semibold text-zinc-900">
                                {book.lessons?.find((l) => l.id === lessonId)?.title ?? lessonId}
                              </td>
                              <td className="px-4 py-2 text-zinc-700">
                                {s.correct}/{s.total}
                              </td>
                              <td className="px-4 py-2 text-zinc-700">
                                {s.total ? clampPct(s.correct / Math.max(1, s.total)) : "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

