/**
 * [INPUT]: 接收 bookId/mode/vocab（由服务端路由页面注入）
 * [OUTPUT]: 练习界面与答案判定，通过 recordAnswer() 写入本地统计
 * [POS]: components/practice/ 的核心交互渲染器，被 src/app/practice/.../[mode]/page.tsx 消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ModeId, recordAnswer } from "@/lib/storage/stats";
import type { VocabItem } from "@/lib/data/booksVocab";

// ---------- 工具函数 ----------

function normalizeForCompare(s: string): string {
  return s.replace(/\s+/g, "").trim().toLowerCase();
}

/** Fisher-Yates 洗牌（接受种子，只在初始化时跑一次） */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * 从词池中挑 3 个干扰项：
 * 1. 优先同课
 * 2. 不足则从全书补充
 * 3. 最终随机排布（含正确答案）
 */
function pickDistractors(current: VocabItem, pool: VocabItem[], count = 3): VocabItem[] {
  const sameLessonPool = pool.filter(
    (it) => it.id !== current.id && it.lessonId === current.lessonId,
  );
  const otherPool = pool.filter(
    (it) => it.id !== current.id && it.lessonId !== current.lessonId,
  );
  const shuffledSame = shuffle(sameLessonPool);
  const shuffledOther = shuffle(otherPool);
  const combined = [...shuffledSame, ...shuffledOther];
  return combined.slice(0, count);
}

// ---------- 设置 ----------

type PracticeSettings = {
  clickToJudge: boolean; // 点即判（true）vs 点提交再判（false）
};

const DEFAULT_SETTINGS: PracticeSettings = { clickToJudge: true };

const SETTINGS_KEY = "kw:practice:settings";

function loadSettings(): PracticeSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<PracticeSettings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(s: PracticeSettings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

// ---------- 练习队列管理 ----------

type QueueItem = {
  vocab: VocabItem;
  /** 第几次出现（错题重入后 +1） */
  attempt: number;
};

function buildQueue(vocab: VocabItem[]): QueueItem[] {
  return shuffle(vocab).map((v) => ({ vocab: v, attempt: 1 }));
}

/** 把错题插到队列当前位置后 3~5 位处 */
function reinsertWrong(queue: QueueItem[], currentIdx: number, item: QueueItem): QueueItem[] {
  const next = [...queue];
  const insertAt = Math.min(currentIdx + 3 + Math.floor(Math.random() * 3), next.length);
  next.splice(insertAt, 0, { ...item, attempt: item.attempt + 1 });
  return next;
}

// ---------- 状态类型 ----------

type AnswerState =
  | { phase: "idle" }
  | { phase: "judged"; correct: boolean; correctAnswer: string; selectedId?: string };

// ---------- 主组件 ----------

export default function PracticeModeClient({
  bookId,
  mode,
  vocab,
}: {
  bookId: string;
  mode: ModeId;
  vocab: VocabItem[];
}) {
  // 设置（从 localStorage 读取，只在挂载时加载一次）
  const [settings, setSettings] = useState<PracticeSettings>(() => loadSettings());

  // 练习队列（初始化一次，之后动态修改）
  const [queue, setQueue] = useState<QueueItem[]>(() => buildQueue(vocab));
  const [idx, setIdx] = useState(0);

  // 答题状态
  const [answerState, setAnswerState] = useState<AnswerState>({ phase: "idle" });
  const [userText, setUserText] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 统计
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  const currentItem = queue[idx];
  const current = currentItem?.vocab;
  const isFinished = idx >= queue.length;

  // ---------- 选择题选项（每道题重新生成，含洗牌） ----------
  const mcqOptions = useMemo(() => {
    if (!current || mode !== "mcq") return [];
    const distractors = pickDistractors(current, vocab);
    return shuffle([current, ...distractors]);
  }, [current, mode, vocab]);

  // ---------- 判题逻辑 ----------
  const judge = useCallback(
    (chosenId?: string, freeText?: string) => {
      if (!current || answerState.phase === "judged") return;

      let correct = false;
      let correctAnswer = "";
      let usedSelectedId: string | undefined;

      if (mode === "mcq") {
        const id = chosenId ?? selectedId;
        if (!id) return;
        correct = id === current.id;
        correctAnswer = current.chinese;
        usedSelectedId = id;
        setSelectedId(id);
      } else {
        const text = (freeText ?? userText).trim();
        if (!text) return;
        const expected = mode === "cn2kr" ? current.korean : current.chinese;
        correct = normalizeForCompare(expected) === normalizeForCompare(text);
        correctAnswer = expected;
      }

      setTotalAnswered((n) => n + 1);
      if (correct) setCorrectCount((n) => n + 1);
      recordAnswer({ bookId, lessonId: current.lessonId, mode, correct });

      setAnswerState({ phase: "judged", correct, correctAnswer, selectedId: usedSelectedId });

      // 错题重入队列
      if (!correct && currentItem) {
        setQueue((q) => reinsertWrong(q, idx, currentItem));
      }
    },
    [current, currentItem, answerState.phase, mode, selectedId, userText, bookId, idx],
  );

  // ---------- 前进到下一题 ----------
  const goNext = useCallback(() => {
    setAnswerState({ phase: "idle" });
    setUserText("");
    setSelectedId(null);
    setIdx((n) => n + 1);
    // 小延时后 focus 输入框（填空模式）
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  // ---------- 快捷键：Space / → 前进 ----------
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // 填空模式下 Space 是输入字符，不拦截
      if (answerState.phase !== "judged") return;
      if (e.key === " " || e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        goNext();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answerState.phase, goNext]);

  // ---------- 设置更新 ----------
  function updateSettings(patch: Partial<PracticeSettings>) {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveSettings(next);
      return next;
    });
  }

  // ---------- 结束画面 ----------
  if (isFinished) {
    const accuracy = totalAnswered === 0 ? 0 : Math.round((correctCount / totalAnswered) * 100);
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm text-center">
        <div className="text-4xl mb-3">🎉</div>
        <div className="text-xl font-bold text-zinc-900">本轮练习完成！</div>
        <div className="mt-2 text-sm text-zinc-500">
          共答 {totalAnswered} 题，正确 {correctCount} 题，正确率 {accuracy}%
        </div>
        <button
          type="button"
          onClick={() => {
            setQueue(buildQueue(vocab));
            setIdx(0);
            setAnswerState({ phase: "idle" });
            setUserText("");
            setSelectedId(null);
            setCorrectCount(0);
            setTotalAnswered(0);
          }}
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800"
        >
          再练一轮
        </button>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <div className="text-sm font-semibold text-zinc-900">暂无可练习内容</div>
        <div className="mt-1 text-xs text-zinc-600">请先选择一个可用书籍/课。</div>
      </div>
    );
  }

  const judged = answerState.phase === "judged";
  const isCorrect = judged && answerState.correct;

  // 进度：按初始 vocab 数量算（不含重入的错题）
  const progressPct = Math.min(100, Math.round((idx / vocab.length) * 100));
  const progressText = String(Math.min(idx + 1, vocab.length)) + "/" + String(vocab.length);

  const modeLabel =
    mode === "cn2kr" ? "中 → 韩（默写）" : mode === "kr2cn" ? "韩 → 中（填写）" : "韩 → 中（选择）";

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
      {/* 顶部进度条 */}
      <div className="h-1.5 bg-zinc-100">
        <div
          className="h-full bg-zinc-900 transition-all duration-300"
          style={{ width: progressPct + "%" }}
        />
      </div>

      <div className="p-6">
        {/* 标题行 */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-semibold text-zinc-900">{modeLabel}</div>
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span>{progressText}</span>
            <span>
              正确率：
              {totalAnswered === 0
                ? "-"
                : String(Math.round((correctCount / totalAnswered) * 100)) + "%"}
              （{correctCount}/{totalAnswered}）
            </span>
          </div>
        </div>

        {/* 题目区 */}
        <div className="mt-6">
          {/* 填空：中→韩 */}
          {mode === "cn2kr" && (
            <>
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                中文提示
              </div>
              <div className="mt-2 text-3xl font-bold text-zinc-900">{current.chinese}</div>
              <div className="mt-5">
                <input
                  ref={inputRef}
                  value={userText}
                  onChange={(e) => setUserText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (judged) goNext();
                      else judge(undefined, userText);
                    }
                  }}
                  disabled={judged}
                  className={
                    "w-full rounded-xl border px-4 py-3 text-lg outline-none transition-colors " +
                    (judged
                      ? isCorrect
                        ? "border-emerald-400 bg-emerald-50 text-emerald-900"
                        : "border-red-400 bg-red-50 text-red-900"
                      : "border-zinc-300 bg-white focus:border-zinc-500")
                  }
                  placeholder="请输入韩文（Enter 提交）"
                />
              </div>
            </>
          )}

          {/* 填空：韩→中 */}
          {mode === "kr2cn" && (
            <>
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                韩文提示
              </div>
              <div className="mt-2 text-3xl font-bold text-zinc-900">{current.korean}</div>
              <div className="mt-5">
                <input
                  ref={inputRef}
                  value={userText}
                  onChange={(e) => setUserText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (judged) goNext();
                      else judge(undefined, userText);
                    }
                  }}
                  disabled={judged}
                  className={
                    "w-full rounded-xl border px-4 py-3 text-lg outline-none transition-colors " +
                    (judged
                      ? isCorrect
                        ? "border-emerald-400 bg-emerald-50 text-emerald-900"
                        : "border-red-400 bg-red-50 text-red-900"
                      : "border-zinc-300 bg-white focus:border-zinc-500")
                  }
                  placeholder="请输入中文（Enter 提交）"
                />
              </div>
            </>
          )}

          {/* 选择题 */}
          {mode === "mcq" && (
            <>
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                韩文
              </div>
              <div className="mt-2 text-3xl font-bold text-zinc-900">{current.korean}</div>
              <div className="mt-5 space-y-3">
                {mcqOptions.map((opt) => {
                  const isSelected =
                    judged
                      ? answerState.selectedId === opt.id
                      : selectedId === opt.id;
                  const isCorrectOpt = opt.id === current.id;

                  let optCls =
                    "w-full rounded-xl border px-4 py-3 text-left transition-colors ";
                  if (judged) {
                    if (isCorrectOpt) {
                      optCls += "border-emerald-500 bg-emerald-50 text-emerald-900";
                    } else if (isSelected && !isCorrectOpt) {
                      optCls += "border-red-400 bg-red-50 text-red-800";
                    } else {
                      optCls += "border-zinc-200 bg-white text-zinc-500";
                    }
                  } else {
                    optCls +=
                      isSelected
                        ? "border-zinc-900 bg-zinc-50"
                        : "border-zinc-200 bg-white hover:bg-zinc-50";
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={judged && !settings.clickToJudge}
                      onClick={() => {
                        if (judged) return;
                        if (settings.clickToJudge) {
                          judge(opt.id);
                        } else {
                          setSelectedId(opt.id);
                        }
                      }}
                      className={optCls}
                    >
                      <span className="text-sm font-semibold">{opt.chinese}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* 答题反馈 */}
        {judged && (
          <div
            className={
              "mt-5 rounded-xl px-4 py-3 text-sm font-semibold " +
              (isCorrect
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700")
            }
          >
            {isCorrect ? (
              "✓ 正确！"
            ) : (
              <span>
                ✗ 答案是：
                <span className="ml-1 font-bold">{answerState.correctAnswer}</span>
                {currentItem.attempt > 1 && (
                  <span className="ml-2 text-xs opacity-70">（错题重入，第 {currentItem.attempt} 次）</span>
                )}
              </span>
            )}
          </div>
        )}

        {/* 操作按钮区 */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {/* 提交按钮：仅在"非点即判"且 mcq 未判时显示；填空始终显示（若未判） */}
          {!judged && mode === "mcq" && !settings.clickToJudge && (
            <button
              type="button"
              onClick={() => judge()}
              className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              提交答案
            </button>
          )}
          {!judged && mode !== "mcq" && (
            <button
              type="button"
              onClick={() => judge()}
              className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              提交答案
            </button>
          )}

          {/* 下一题（判题后显示） */}
          {judged && (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              下一题 <span className="ml-2 text-xs opacity-60">Space / →</span>
            </button>
          )}

          {/* 跳过（未判时显示） */}
          {!judged && (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-2 text-sm font-semibold text-zinc-500 hover:bg-zinc-50"
            >
              跳过
            </button>
          )}
        </div>

        {/* 底部设置区 */}
        {mode === "mcq" && (
          <div className="mt-6 border-t border-zinc-100 pt-4">
            <label className="flex cursor-pointer items-center gap-2 text-xs text-zinc-500 select-none">
              <input
                type="checkbox"
                checked={settings.clickToJudge}
                onChange={(e) => updateSettings({ clickToJudge: e.target.checked })}
                className="rounded"
              />
              点击选项即判（关闭后需手动点"提交答案"）
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
