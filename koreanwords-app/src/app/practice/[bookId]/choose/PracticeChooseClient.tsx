/**
 * [INPUT]: 依赖 bookId、bookTitle、lessonMetas（课名列表）、各课词数统计（由 Server 注入）
 * [OUTPUT]: 客户端交互的"选范围 + 选模式"入口，携带 lessonIds query 参数跳转到 /practice/[bookId]/[mode]
 * [POS]: practice/[bookId]/choose/ 的纯客户端子组件；父 page.tsx 为 Server Component 负责注入数据
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LessonMeta } from "@/lib/data/booksMeta";

type Props = {
  bookId: string;
  bookTitle: string;
  lessonMetas: LessonMeta[];
  wordCountByLesson: Record<string, number>;
};

const MODE_META = [
  { mode: "mcq", title: "选择题", subtitle: "看韩文，选正确中文", icon: "◎" },
  { mode: "kr2cn", title: "韩→中默写", subtitle: "看韩文，输入中文释义", icon: "✏️" },
  { mode: "cn2kr", title: "中→韩默写", subtitle: "看中文，输入正确韩文", icon: "✍️" },
] as const;

type RangeMode = "all" | "single" | "multi";

export default function PracticeChooseClient({
  bookId,
  bookTitle,
  lessonMetas,
  wordCountByLesson,
}: Props) {
  const router = useRouter();
  const [rangeMode, setRangeMode] = useState<RangeMode>("single");
  const [singleLesson, setSingleLesson] = useState<string>(lessonMetas[0]?.id ?? "");
  const [multiSelected, setMultiSelected] = useState<Set<string>>(new Set([lessonMetas[0]?.id ?? ""]));

  const totalAll = Object.values(wordCountByLesson).reduce((a, b) => a + b, 0);

  // 计算当前范围的 lessonIds 和词数
  const selectedIds: string[] =
    rangeMode === "all"
      ? lessonMetas.map((l) => l.id)
      : rangeMode === "single"
        ? singleLesson ? [singleLesson] : []
        : Array.from(multiSelected).sort();

  const selectedWordCount = selectedIds.reduce(
    (sum, id) => sum + (wordCountByLesson[id] ?? 0),
    0,
  );

  function toggleMulti(id: string) {
    setMultiSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size > 1) next.delete(id); // 至少保留 1 课
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function startPractice(mode: string) {
    if (selectedIds.length === 0) return;
    const query = selectedIds.map((id) => encodeURIComponent(id)).join(",");
    router.push(`/practice/${bookId}/${mode}?lessonIds=${query}`);
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-bold text-zinc-900">练习：{bookTitle}</h1>
      <p className="mt-1 text-sm text-zinc-500">选好范围再选模式，开始练习。</p>

      {/* 范围类型 */}
      <div className="mt-6">
        <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-2">
          练习范围
        </div>
        <div className="flex gap-2 flex-wrap">
          {(
            [
              { key: "all", label: "全部词汇", count: totalAll },
              { key: "single", label: "指定一课" },
              { key: "multi", label: "自选多课" },
            ] as { key: RangeMode; label: string; count?: number }[]
          ).map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setRangeMode(opt.key)}
              className={
                "rounded-xl border px-4 py-2 text-sm font-semibold transition-colors " +
                (rangeMode === opt.key
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50")
              }
            >
              {opt.label}
              {opt.count != null && (
                <span className="ml-1.5 text-xs opacity-70">{opt.count}词</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 指定一课：下拉选 */}
      {rangeMode === "single" && (
        <div className="mt-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-2">
            选择课次
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {lessonMetas.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setSingleLesson(l.id)}
                className={
                  "flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors " +
                  (singleLesson === l.id
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-white")
                }
              >
                <span className="text-sm font-semibold">{l.title}</span>
                <span className={"text-xs " + (singleLesson === l.id ? "opacity-70" : "text-zinc-400")}>
                  {wordCountByLesson[l.id] ?? 0}词
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 自选多课：多选按钮 */}
      {rangeMode === "multi" && (
        <div className="mt-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-2">
            选择课次（可多选）
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {lessonMetas.map((l) => {
              const checked = multiSelected.has(l.id);
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => toggleMulti(l.id)}
                  className={
                    "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors " +
                    (checked
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-white")
                  }
                >
                  <span
                    className={
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded border text-xs " +
                      (checked ? "border-white bg-white text-zinc-900" : "border-zinc-400 bg-white")
                    }
                  >
                    {checked ? "✓" : ""}
                  </span>
                  <span className="flex-1 text-sm font-semibold">{l.title}</span>
                  <span className={"text-xs " + (checked ? "opacity-70" : "text-zinc-400")}>
                    {wordCountByLesson[l.id] ?? 0}词
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 当前范围摘要 */}
      <div className="mt-5 rounded-xl bg-zinc-50 border border-zinc-100 px-4 py-3 text-sm text-zinc-700 flex items-center justify-between">
        <span>
          已选 <strong>{selectedIds.length}</strong> 课 ·{" "}
          <strong>{selectedWordCount}</strong> 个词汇
        </span>
        {rangeMode !== "all" && (
          <span className="text-xs text-zinc-400">
            {selectedIds
              .map((id) => lessonMetas.find((l) => l.id === id)?.title ?? id)
              .join("、")}
          </span>
        )}
      </div>

      {/* 选择模式 */}
      <div className="mt-6">
        <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-3">
          选择练习模式
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {MODE_META.map((m) => (
            <button
              key={m.mode}
              type="button"
              onClick={() => startPractice(m.mode)}
              disabled={selectedWordCount === 0}
              className="flex flex-col gap-1 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-left shadow-sm hover:bg-white hover:border-zinc-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="text-xl">{m.icon}</span>
              <span className="text-sm font-semibold text-zinc-900">{m.title}</span>
              <span className="text-xs text-zinc-500">{m.subtitle}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
