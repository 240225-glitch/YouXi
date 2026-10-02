# L12 — Word Scramble Bot · 快速检查卡 / Quick Checklist

姓名 / Name: Alex Chen   班级 / Class: 10A

> 代码颜色 / Colour legend: **绿色 = 注释 / 解释**；**青 / 蓝 / 紫 / 白 = 可执行代码**
> HTML 页面部件 · CSS 外观布局 · JavaScript 游戏大脑 · DOM 运行中可读改的页面

## 代码理论 / Quick theory（先读懂再动手）

- [x] **HTML** — 看板（回合 / 玩家分 / 电脑分 / 时间）、计时条、CLUE 提示词、打乱单词、输入框与 SUBMIT、START / HINT / BOT / RESCUE / RESET 按钮、状态行、结果弹窗
- [x] **CSS** — 青蓝主色 + 霓虹配色、打乱单词的混洗动画、计时条渐变与最后 3 秒红闪、按钮 hover / 禁用态、弹窗高亮
- [x] **JavaScript** — 事件监听 → 改分数 → 判断输赢规则（`click → submitAnswer / useHint`、`setInterval → botStealsRound`）
- [x] **DOM** — 运行中实时改 `textContent` / `className` / `disabled` / `value` / 计时条 `style.width`
- 读代码四问：① 什么触发？(`startBtn` click → `startRound` → `startClock`)
  ② 什么值在变？(`round, playerScore, botScore, timeLeft, answer, scrambled, hintUsed`)
  ③ 检查什么条件？(`isCorrect(guess)` 答对、`timeLeft <= 0` 超时、`score >= WIN_SCORE` 到 5 分)
  ④ 跑完玩家看到什么？(打乱字母 + 计时条变化 + 状态行 + 结果弹窗)

## 我会… / I can… (built + verified)

- [x] **use strings and arrays / 使用字符串和数组** — `WORDS` 数组存 `{word, clue}`，`word.split("")` → `join("")` 完成打乱
- [x] **compare normalized input / 规范化后比较** — `normalize()` = `trim + toLowerCase + 去空格`，大写与前后空格都不会输掉回合
- [x] **create time pressure / 创造时间压力** — `setInterval` 每 100ms 扣时，`timeLeft <= 0` 时 `botStealsRound()` 电脑得分
- [x] 中文关键词：单词 word · 打乱 scramble · 提示 hint

## 45 分钟流程 / Build path 逐段测试

- [x] **0–5 Launch** — 建 `L12` 文件夹，页面部件齐全（看板四项、计时条、CLUE、打乱词、输入框、按钮、状态行）
- [x] **12–25 Build A** — STEP1 页面部件 + 词表；STEP2 `scrambleWord()` 打乱字母（100 次抽样 0 次出现原词）
- [x] **25–36 Build B** — STEP3 `normalize()` 忽略大小写判分；STEP4 计时归零电脑得分，先到 5 分定胜负
- [x] **36–41 Test like a player** — 正确 / 错误 / 全大写 / 超时 四条路径全部在 Chrome 中试过
- [x] **自动化测试 59 项检查全部通过**，0 控制台报错（Node + headless Chrome）

## Rescue Mode + Level Up

- [x] **RESCUE** — 固定热身词 `scramble` + 提示，计时器显示 ∞ 不跑，电脑不出手；再点一次回到随机词表
- [x] **LEVEL UP: HINT 按钮** — 扣 3 分显示首字母（`HINT −3`），分数不足时状态行提示 `NEED 3 POINTS`
- [x] **LEVEL UP: Easy / Hard 电脑** — `BOT_SECONDS = { easy: 20, hard: 10 }`，难度按钮切换每回合时限

## 测试记录 / Test Records

- [x] 开局前 — 看板 0 / 0 / 0 / –，输入框与 SUBMIT 禁用，状态行 PRESS START
- [x] START → 回合 1，打乱词与原词字母相同但顺序不同，CLUE 显示，输入框可用，计时条开始走
- [x] 答错 `zzzzzz` → 状态 `NOT QUITE`、分数不变、回合继续、`wrongTries = 1`
- [x] 空输入提交 → `TYPE A WORD FIRST`，不判负
- [x] 全大写 `KEYBOARD` 答对 → 得分、状态 `CORRECT`、按钮变 `NEXT WORD / 下一词`
- [x] 前后空格 + 大写 `"  ISLAND  "` 答对 → 规范化比较生效
- [x] 计时归零 → `BOT SCORES!`、电脑 +1 分、`timeouts = 1`、回合结束
- [x] HINT → 玩家 −3 分、状态显示首字母、`hintUsed = true`、按钮禁用；按 `H` 快捷键在分数不足时提示 `NEED 3 POINTS`
- [x] 玩家到 5 分 → 弹窗 `YOU WIN! / 你赢了`（含姓名班级、Solved / Wrong / Timeouts / Hints 统计）
- [x] 电脑到 5 分 → 弹窗 `BOT WINS! / 电脑赢了`
- [x] RESET 清零并隐藏弹窗；难度切换 EASY 20s ↔ HARD 10s；RESCUE 固定词 `scramble` 计时 ∞
- [x] **59/59 PASS · 控制台 0 报错**（headless Chrome 实测）
- [x] 截图 4 张：screenshot-1-idle / 2-mid / 3-win(玩家获胜) / 4-loss(电脑获胜)

## 最后一页提交要求 / Final 10 minutes turn-in

- [x] 1. 加上姓名与班级 — 游戏内 NAME=`Alex Chen`、CLASS=`10A`，结果弹窗会显示
- [x] 2. 正确保存/导出 — `index.html` + `style.css` + `script.js` 三个文件，双击 index.html 即可在 Chrome 运行
- [x] 3. 提交正确的文件 — `L12.zip`（内含 L12 文件夹全部文件）
- [x] 4. 同伴互查 / Partner check — 玩一局：打乱词可还原 ✓ 答对得分 ✓ 超时电脑得分 ✓ HINT 扣 3 分 ✓ 先到 5 分定胜负 ✓
- [x] **上交：ZIP L12 文件夹 + 胜负结果截图**（`screenshot-3-win.png` 玩家获胜、`screenshot-4-loss.png` 电脑获胜）

## I can… / 我会…

- [x] use strings and arrays / 使用字符串和数组
- [x] compare normalized input / 规范化后比较输入
- [x] create time pressure / 创造时间压力
