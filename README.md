# 米米打卡 · Benmi-Gym

「米米专属偏头痛与颈肩辅助训练 30 天」——笨笨 + 米米情侣打卡 Web App。

- 日期：**2026-09-09 → 2026-10-08**（界面日期标签按 **Australia/Sydney**）
- 技术栈：Vite + React + TypeScript + Tailwind CSS
- 数据：优先 `localStorage`（键名 `benmi-couple-state`），可离线使用；预留后续接入 Supabase

## 本地运行

```bash
cd Benmi-Gym
npm install
npm run dev
```

浏览器打开终端提示的本地地址（通常是 `http://localhost:5173`）。

生产构建：

```bash
npm run build
npm run preview
```

## 功能概览

1. **引导页**：选择自己是「笨笨」或「米米」（可自定义昵称），并看到搭档名称。
2. **今日清单**：按 Sydney 日期自动选中当天；范围外则落在 Day1 或 Day30。
3. **双人勾选**：当前用户勾选；同屏可见搭档勾选状态（同设备 localStorage）。
4. **同步码**：压缩 Base64 文本（`BENMI1:…`）复制给对方「应用同步码」；支持 JSON 导出/导入与 URL `#sync=` 哈希同步。
5. **动作库**：每个动作配有多帧 SVG 图解 + 中文要点。
6. **日历**：30 天双方完成百分比；Day 7 / 14 / 21 / 28 为**恢复日**。
7. **预置**：米米 Day1、Day2 已全部勾选。
8. **安全提示**横幅；Day30 全部完成时庆祝动画。

## 情侣同步怎么用（无后端）

| 方式 | 说明 |
|------|------|
| 同手机/同浏览器 | 自动读写 `localStorage` 键 `benmi-couple-state` |
| 两部手机 | 「同步」页 → 生成同步码 → 发给对方 → 对方粘贴并应用（勾选取**并集**） |
| JSON | 导出完整状态文件/文本，对方导入合并 |
| URL 哈希 | 生成同步码后地址栏可能带 `#sync=…`，对方打开同一链接可合并（码过长时可能不写入哈希） |

> **局限**：这不是实时云同步。两机需手动交换同步码/JSON。冲突时按并集合并勾选。完整云端（账号、实时、冲突解决）需要之后接入 **Supabase**。

## 部署

### Vercel

1. 将本仓库推送到 GitHub（例如 `Benmi-Gym`）。
2. [vercel.com](https://vercel.com) Import 该仓库。
3. Framework Preset 选 Vite，Build Command `npm run build`，Output `dist`。
4. Deploy。

### GitHub Pages

`vite.config.ts` 已设置 `base: './'`，相对路径可直接用于 Pages。

1. `npm run build`
2. 将 `dist/` 内容发布到 `gh-pages` 分支，或在仓库 Settings → Pages 选择 GitHub Actions / 分支部署。
3. 若站点不在根路径（如 `https://user.github.io/Benmi-Gym/`），把 `base` 改成 `'/Benmi-Gym/'` 后重新构建。

## 项目结构（节选）

```
src/
  assets/exercises/   # 各动作 SVG 图解
  data/               # 类型、动作库要点、30 天计划
  hooks/              # useCoupleState
  lib/sync.ts         # localStorage + 同步码
  components/         # UI
```

## 免责声明

本应用提供的训练内容仅供一般性辅助参考，不能替代专业医疗建议。出现严重症状请及时就医。
