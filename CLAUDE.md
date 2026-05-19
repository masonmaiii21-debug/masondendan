# 外贸操作管理系统 — 项目概览

## 项目位置
C:\Users\35382\foreign-trade-tracker

## 架构
单页应用（SPA），纯前端 HTML + CSS + JS，无框架，部署在 GitHub Pages。

## 文件结构

```
├── nav.html          ← 导航首页（4 个卡片入口）
├── index.html        ← 外贸跟单（主模块）
│   引用: styles.min.css + app.min.js
├── shipping.html     ← 海运操作模块
│   引用: styles.min.css + shipping.min.js
├── docs.html         ← 单证操作模块
│   引用: styles.min.css + docs.min.js
├── customs.html      ← 报关操作模块
│   引用: styles.min.css + customs.min.js
│
├── app.js            ← [编辑此文件] 外贸跟单主逻辑源码 (65KB)
├── styles.css        ← [编辑此文件] 样式源码 (16KB)
│
├── app.min.js        ← 混淆后（不直接编辑）
├── styles.min.css    ← 压缩后（不直接编辑）
├── *.min.js          ← 其他模块混淆版（原始源码已丢失）
│
├── scripts/crypto.js ← 加密/解密脚本
├── package.json      ← npm 脚本
└── .gitignore        ← 保护源码
```

## 当前任务
修改和优化外贸跟单模块。

## 数据流
- localStorage 存储订单数据 (STORAGE_KEY = "foreignTradeTracker.orders.v1")
- 支持 Excel 导入导出（xlsx 库）
- 支持 PDF/Word 文件解析（pdfjs-dist + mammoth.js）
- 20 个订单阶段：询盘→报价→寄样→...→退税→完成
- 5 种状态：进行中、已延迟、有风险、暂停、已完成

## 安全机制
- 源码用 AES-256-GCM 加密存储（app.js.enc / styles.css.enc）
- GitHub Pages 只部署混淆后的 .min.js
- 本机已信任，Codex 可直接编辑 app.js 和 styles.css

## 编辑完后的步骤
```
npm run lock    # 重新加密源码
# 然后手动混淆: javascript-obfuscator app.js -o app.min.js
# 提交推送
```

## 项目更新日志

### 2026-05-19 17:38:30 +08:00 — 六大板块整合与公网发布

本次已将项目从原 4 个入口整理为 6 个业务板块，并完成 GitHub Pages 公网发布。

#### 当前六大板块

| 板块 | 页面 | 运行脚本 |
| --- | --- | --- |
| 外贸跟单 | `index.html` | `order-data.min.js` + `app.min.js` |
| 海运操作 | `shipping.html` | `shipping-data.min.js` + `shipping.min.js` |
| 空运操作 | `air.html` | `air-data.min.js` + `air.min.js` |
| 海运单证 | `docs.html` | `docs-data.min.js` + `docs.min.js` |
| 空运单证 | `air-docs.html` | `air-docs-data.min.js` + `air-docs.min.js` |
| 报关操作 | `customs.html` | `customs-data.min.js` + `customs.min.js` |

#### 本次完成内容

- 新增 `air.html` 空运操作板块。
- 新增 `air-docs.html` 空运单证板块，包含 AWB、MAWB、HAWB、安检、报关、到港和归档流程。
- 原 `docs.html` 已更名为海运单证。
- `nav.html` 已整合为六大板块统一导航页，恢复为原来的彩色卡片入口风格。
- 六个业务板块均已增加或统一语言切换：
  - 中文
  - English
  - 中英双语
- 语言选择统一保存到浏览器本地键：`foreignTradeTracker.langMode.v1`。
- `scripts/build.js` 已加入所有新增源码的构建任务。
- `scripts/crypto.js` 已加入所有新增源码的 AES-256-GCM 加密/解密清单。
- 已执行构建并生成所有 `.min.js` / `styles.min.css`。
- 已执行 `npm run lock`，源码已重新加密为 `.enc`。
- 已提交并推送到 GitHub：`3d41900 Add six-module operations hub`。

#### 公网地址

导航首页：

```text
https://masonmaiii21-debug.github.io/masondendan/nav.html
```

各板块地址：

```text
https://masonmaiii21-debug.github.io/masondendan/index.html
https://masonmaiii21-debug.github.io/masondendan/shipping.html
https://masonmaiii21-debug.github.io/masondendan/air.html
https://masonmaiii21-debug.github.io/masondendan/docs.html
https://masonmaiii21-debug.github.io/masondendan/air-docs.html
https://masonmaiii21-debug.github.io/masondendan/customs.html
```

#### 验证记录

- 本地预览地址 `http://127.0.0.1:8787/nav.html` 已验证 6 个入口正常。
- 公网地址 `https://masonmaiii21-debug.github.io/masondendan/nav.html` 已验证 6 个入口正常。
- 公网导航页语言切换已验证存在，选项顺序为：中文 / English / 中英双语。
- 公网导航页链接均为相对路径，适合 GitHub Pages 或其他静态公网部署。

#### 后续维护提醒

- 编辑源码前运行：`npm run unlock`。
- 编辑完成后运行：`npm run build`。
- 最后运行：`npm run lock`。
- 发布公网前提交并推送到 `origin master`。

### 2026-05-19 19:15:55 +08:00 — 语言切换与节点间距优化

本次根据页面反馈优化六大板块在中文、English、中英双语三种语言模式下的显示效果。

#### 本次完成内容

- 导航页保留标题 `外贸操作管理系统`。
- 删除导航页重复副标题 `Foreign Trade Operations Hub / Foreign Trade Operations Hub`。
- 删除导航页语言控件前的 `语言 / Language` 文案，仅保留下拉选项。
- 六个业务板块的流程节点已按语言模式自动调整横向间距：
  - 中文：节点保持紧凑，适合日常办公快速查看。
  - English：节点加宽，避免英文标题挤压。
  - 中英双语：节点进一步加宽，并通过横向滚动查看完整流程。
- 语言切换时为节点间距和节点尺寸增加过渡效果，切换更顺滑。
- 已执行 `npm run build` 重新生成发布文件。
- 已执行 `npm run lock`，源码已重新加密为 `.enc`。

#### 验证记录

- 已确认导航标题仍保留。
- 已确认导航副标题和语言文字标签已移除。
- 已确认六个板块都写入语言状态，用于触发对应节点间距样式。
- 公网复查时发现原有固定列宽仍会压缩部分节点，已补充覆盖规则，确保横向滚动节点使用新的语言间距。
- 本地浏览器对 `localhost` 预览被浏览器策略拦截，本次先完成静态检查；推送后使用 GitHub Pages 公网地址复查。
