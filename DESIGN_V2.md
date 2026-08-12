# KoreanWords V2 设计文档（可审计）

## 1. 目标与范围

### 1.1 业务目标
- 将当前单页默写工具升级为可持续迭代的无账号学习工具站。
- 保持 Vercel 部署友好，优先自然流量（SEO）与读请求并发承载能力。
- 为后续扩展 `延世韩国语 2/3/4` 与更多学习功能预留稳定架构。

### 1.2 非目标（V1 不做）
- 不做账号体系（登录、云端同步、多人协作）。
- 不做付费、权限、复杂后端服务。
- 不做重度实时功能（聊天室、实时对战）。

### 1.3 成功标准（验收）
- UI 与交互达到“简洁学习类产品”基线（移动端可用、视觉统一、操作路径短）。
- 支持多模式练习：中->韩、韩->中、选择题。
- 支持学习进度统计（本地持久化）。
- 支持词表浏览检索（按书/课/关键词过滤）。
- 支持多书切换入口（2/3/4 占位可上线）。
- SEO 基础设施完整：语义路由、metadata、sitemap、robots、结构化数据。

---

## 2. 现状与问题

### 2.1 当前实现
- 纯静态 HTML + CSS + 内联 JS。
- 词表主要在 `data.js` 中硬编码，另有 `words_list.csv`。
- 功能集中在一个页面，状态以运行时内存为主（刷新即丢）。

### 2.2 关键问题
- **可扩展性差**：新增词书、模式、统计都需要修改耦合代码。
- **SEO 基础薄弱**：无语义化路由、无 sitemap/结构化数据。
- **可维护性低**：UI、逻辑、数据混杂，缺少模块边界。
- **并发策略隐含风险**：目前虽轻，但无清晰的“静态优先”架构定义。

---

## 3. 总体架构决策

### 3.1 技术栈
- 框架：`Next.js`（App Router）
- 语言：`TypeScript`
- 样式：`Tailwind CSS`（简洁学习风，快速建立一致设计系统）
- 部署：`Vercel`
- 数据：仓库内结构化静态文件（JSON），构建期读取
- 状态持久化：`localStorage`

### 3.2 架构原则
- **静态优先**：读场景为主，页面尽量 SSG，提升 SEO 与并发承载。
- **数据与展示分离**：词库、练习引擎、UI 组件解耦。
- **可扩展模式引擎**：新增学习模式不改核心流程。
- **渐进增强**：先无账号完成学习闭环，后续可平滑接入服务端。

### 3.3 渲染策略
- 书籍页、课页、词表页：`SSG`
- 检索与练习交互：客户端渲染（必要状态在浏览器端）
- 保留未来切换到部分 ISR 的能力（词库频繁更新时启用）

---

## 4. 信息架构与路由

### 4.1 页面结构
- `/`：首页（价值说明 + 快速入口）
- `/books`：词书总览（1/2/3/4）
- `/books/[bookId]`：词书详情（章节入口、练习入口）
- `/books/[bookId]/lessons/[lessonId]`：课级页面（词表 + 练习）
- `/practice/[bookId]`：练习入口（模式选择）
- `/practice/[bookId]/[mode]`：具体练习模式
- `/vocab/[bookId]`：词表检索页（可带 query 过滤）
- `/stats`：学习进度统计页

### 4.2 占位书策略
- `yonsei-2/3/4` 在 `/books` 可见并可进入详情。
- 若无数据，展示 `Coming Soon`、预期计划、数据贡献入口（可选）。

---

## 5. 数据模型设计

### 5.1 目录规范
- `data/books/yonsei-1.json`
- `data/books/yonsei-2.json`（占位）
- `data/books/yonsei-3.json`（占位）
- `data/books/yonsei-4.json`（占位）
- `data/books.meta.json`（书级元信息）

### 5.2 Schema（审计基线）
```ts
type BookMeta = {
  id: "yonsei-1" | "yonsei-2" | "yonsei-3" | "yonsei-4";
  title: string;            // e.g. 延世韩国语 1
  level: number;            // 1..4
  status: "ready" | "coming_soon";
  lessonCount: number;
  updatedAt: string;        // ISO-8601
};

type VocabItem = {
  id: string;               // 全局唯一，建议 book-lesson-index
  bookId: string;
  lessonId: string;         // e.g. lesson-01
  korean: string;
  chinese: string;
  pos?: string;             // 词性，可空
  example?: string;         // 例句，可空
  tags?: string[];          // 可选标签
};
```

### 5.3 数据质量规则
- `korean/chinese` 必填且去除前后空白。
- `id` 唯一，不允许重复词条 ID。
- `lessonId` 需符合命名规范（`lesson-xx`）。
- 构建阶段执行校验，失败即阻断构建。

---

## 6. 功能设计

### 6.1 多书切换
- 首页和 `/books` 提供词书入口卡片。
- 书籍状态由 `books.meta.json` 驱动。
- `coming_soon` 状态不进入练习流，只展示引导信息。

### 6.2 三种练习模式
- **中->韩默写**：展示中文释义，输入韩文。
- **韩->中回忆**：展示韩文，输入中文关键释义。
- **选择题速测**：四选一，干扰项来自同书同课优先。

统一机制：
- 抽题器：支持按书/课范围出题。
- 判题器：模式差异通过策略对象实现。
- 会话状态：当前题、正确率、耗时、错题列表。

### 6.3 学习进度统计（本地）
- 指标：
  - 今日练习题数
  - 今日正确率
  - 近 7 天连续学习天数
  - 各书/各课完成率
- 存储键命名：`kw:v2:stats:*`
- 数据版本号：`kw:v2:schemaVersion`
- 版本升级时执行一次迁移逻辑，保证兼容。

### 6.4 词表浏览检索
- 过滤维度：
  - 书（book）
  - 课（lesson）
  - 关键词（韩文/中文）
  - 词性（可选）
- 交互：
  - 输入即过滤（客户端）
  - URL 同步查询参数（便于分享与收录）

---

## 7. UI/UX 设计基线（简洁学习类）

### 7.1 视觉系统
- 浅色背景 + 高对比文本 + 单主色强调。
- 卡片化布局，圆角适中，弱阴影。
- 字号层级明确：标题 > 词条 > 注释 > 辅助信息。

### 7.2 组件层级
- Layout（Header/Nav/Main/Footer）
- BookCard / LessonCard
- PracticePanel
- ProgressCard
- VocabTable + FilterBar
- EmptyState / LoadingState / ErrorState

### 7.3 可用性要求
- 键盘友好（Enter 提交、方向键切题可选）。
- 移动端优先（>=360px 可用）。
- 错误反馈即时且语义明确。

---

## 8. SEO 设计

### 8.1 Metadata 规则
- 每个路由独立 `title/description`。
- canonical 固定为线上主域名路径。
- Open Graph / Twitter 卡片统一模板。

### 8.2 站点索引
- 自动生成 `sitemap.xml`：
  - 首页
  - 书级页面
  - 课级页面（仅有数据的课）
  - 词表主页面
- `robots.txt` 允许主内容抓取，屏蔽无意义查询页（按需）。

### 8.3 结构化数据
- 首页：`WebSite`
- 列表页：`BreadcrumbList`
- 课页/词表页：`ItemList`

### 8.4 内容策略
- 每课页面包含可读文本摘要（非纯按钮），提升可索引内容密度。
- URL 语义化且稳定，避免频繁更改路径。

---

## 9. 性能与并发承载

### 9.1 目标
- 首屏 LCP < 2.5s（常规网络）
- JS 体积控制，避免一次性下发全量词库

### 9.2 手段
- 书级/课级数据按需加载（分片 JSON）。
- 页面静态化 + CDN 缓存（Vercel 默认优势）。
- 组件懒加载（非首屏图表或次要模块）。
- 图片与静态资源优化（next/image、压缩、缓存头）。

### 9.3 并发解释
- 主要访问为静态读请求，Vercel CDN 可水平吸收突发访问。
- 无账号无写后端，避免数据库瓶颈与热点写冲突。

---

## 10. 工程结构建议

```txt
src/
  app/
    (routes...)
  components/
    ui/
    practice/
    vocab/
    stats/
  features/
    practice-engine/
      modes/
      evaluator/
      selector/
    stats/
    search/
  lib/
    data/
    seo/
    storage/
  types/
data/
  books/
  books.meta.json
scripts/
  validate-data.ts
```

---

## 11. 迭代计划（里程碑）

### Milestone 1：基础迁移与 UI 重构（1 周）
- Next.js 工程搭建、全站基础布局、主题样式。
- 导入 `yonsei-1` 数据并建立 schema + 校验脚本。
- 跑通 `/books`、`/books/yonsei-1`、`/vocab/yonsei-1`。

### Milestone 2：学习核心能力（1 周）
- 三模式练习引擎与会话状态管理。
- 本地进度统计与 `/stats` 页面。
- 错误态/空态完善，移动端体验优化。

### Milestone 3：SEO 与性能收口（0.5-1 周）
- metadata、sitemap、robots、结构化数据接入。
- 数据分片、包体优化、核心指标压测与修正。
- `yonsei-2/3/4` 占位书入口上线。

---

## 12. 风险与应对

### 12.1 数据来源风险（2/3/4 未就绪）
- 风险：功能入口存在但无实际内容。
- 对策：状态驱动占位 + 透明提示 + 后续热更新流程。

### 12.2 数据质量风险
- 风险：脏数据导致检索或判题异常。
- 对策：构建期数据校验，CI 阻断不合规数据。

### 12.3 SEO 见效周期风险
- 风险：自然流量增长非即时。
- 对策：先打完整技术 SEO，再持续补充课级可读内容。

---

## 13. 回滚与发布策略

### 13.1 发布
- 采用 Vercel Preview 环境逐 PR 验证。
- 主分支发布前执行：类型检查 + 数据校验 + 构建。

### 13.2 回滚
- 若线上异常，Vercel 一键回滚到上一个稳定 deployment。
- 数据变更与代码变更分离提交，便于定位与回退。

---

## 14. 数据接入流程（2/3/4）

1. 收集词表原始文件（CSV/表格）。
2. 运行转换脚本，映射到统一 schema。
3. 运行 `validate-data` 校验。
4. 更新 `books.meta.json` 的状态与课数。
5. 预览环境验证检索、练习、统计是否正常。
6. 合并发布。

---

## 15. 审计清单（Checklist）

- [ ] 路由、组件、数据层是否解耦
- [ ] 三种练习模式是否共享统一引擎
- [ ] 统计是否本地持久化且可迁移
- [ ] 词表检索是否支持书/课/关键词过滤
- [ ] `yonsei-2/3/4` 是否可见且占位语义清晰
- [ ] metadata/sitemap/robots/结构化数据是否齐全
- [ ] 构建期数据校验是否生效
- [ ] Vercel 预览与回滚流程是否可操作

---

## 16. 下一步执行建议

- 立即进入 Milestone 1 的工程迁移实施。
- 同步开展 `yonsei-2/3/4` 数据源审查（版权、质量、完整度）。
- 每个里程碑结束时产出一次审计报告（功能、性能、SEO 三维）。

