import booksMetaJson from "../../../data/books.meta.json";

/**
 * [INPUT]: 依赖仓库内 `data/books.meta.json` 的书籍元信息数组
 * [OUTPUT]: 提供 `getBooksMeta()`（返回所有书的元数据，供页面路由与导航使用）
 * [POS]: lib/data/booksMeta，提供全局书级索引，被首页、/books 列表页、TopNav 等消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
export type LessonMeta = {
  id: string;
  title: string;
};

export type BookMeta = {
  id: string;
  title: string;
  level: number;
  status: "ready" | "coming_soon";
  lessonCount: number;
  lessons?: LessonMeta[];
  updatedAt: string;
};

export function getBooksMeta(): BookMeta[] {
  // V1：去掉缓存，避免开发/热更新期间缓存命中旧的 JSON 模块状态
  return booksMetaJson as BookMeta[];
}

