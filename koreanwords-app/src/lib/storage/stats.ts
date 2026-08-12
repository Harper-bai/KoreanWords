export type ModeId = "cn2kr" | "kr2cn" | "mcq";

/**
 * [INPUT]: 来自练习客户端的答案记录（bookId/lessonId/mode/correct）
 * [OUTPUT]: 本地持久化学习统计状态，并提供 `recordAnswer()`、`computeStreakDays()` 等派生能力
 * [POS]: lib/storage/stats，本地统计的唯一写入点；PracticeModeClient 写入，StatsPage 读取并展示
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
export type LessonStats = {
  total: number;
  correct: number;
};

export type DayStats = LessonStats & {
  date: string; // YYYY-MM-DD
  updatedAt: number;
};

export type BookStats = {
  // 按日期统计（用于连续学习天数与今日进度）
  byDay: Record<string, DayStats>;
  // 按课统计（用于各课完成度）
  byLesson: Record<string, LessonStats>;
};

export type StatsState = {
  schemaVersion: 1;
  byBook: Record<string, BookStats>;
};

const STORAGE_KEY = "kw:v2:stats";

function emptyState(): StatsState {
  return { schemaVersion: 1, byBook: {} };
}

export function loadStats(): StatsState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as StatsState;
    if (!parsed || parsed.schemaVersion !== 1 || typeof parsed !== "object") return emptyState();
    if (!parsed.byBook) parsed.byBook = {};
    return parsed;
  } catch {
    return emptyState();
  }
}

export function saveStats(state: StatsState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function toDateKey(d: Date): string {
  // 本地时区 YYYY-MM-DD
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function recordAnswer(params: {
  bookId: string;
  lessonId: string;
  mode: ModeId;
  correct: boolean;
}) {
  const { bookId, lessonId, correct } = params;
  const state = loadStats();
  const byBook = state.byBook;
  if (!byBook[bookId]) {
    byBook[bookId] = { byDay: {}, byLesson: {} };
  }
  const todayKey = toDateKey(new Date());
  const bookStats = byBook[bookId];

  const day = bookStats.byDay[todayKey] ?? {
    date: todayKey,
    total: 0,
    correct: 0,
    updatedAt: 0,
  };
  day.total += 1;
  if (correct) day.correct += 1;
  day.updatedAt = Date.now();
  bookStats.byDay[todayKey] = day;

  const lesson = bookStats.byLesson[lessonId] ?? { total: 0, correct: 0 };
  lesson.total += 1;
  if (correct) lesson.correct += 1;
  bookStats.byLesson[lessonId] = lesson;

  saveStats(state);
}

export function computeStreakDays(byDay: Record<string, DayStats>): number {
  // 连续学习天数：从“今天或最近一天”向前回溯
  const keys = Object.keys(byDay).filter((k) => (byDay[k]?.total ?? 0) > 0);
  if (keys.length === 0) return 0;
  const toDate = (k: string) => {
    const [y, m, d] = k.split("-").map(Number);
    return new Date(y, m - 1, d);
  };
  const today = new Date();
  const todayKey = toDateKey(today);
  let current = byDay[todayKey]?.total ? today : toDate(keys.sort().slice(-1)[0]);

  let streak = 0;
  while (true) {
    const key = toDateKey(current);
    if ((byDay[key]?.total ?? 0) <= 0) break;
    streak += 1;
    current = new Date(current);
    current.setDate(current.getDate() - 1);
  }
  return streak;
}

