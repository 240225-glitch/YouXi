# L11 — Dice Strategy Duel · 快速检查卡 / Quick Checklist

姓名 / Name: Alex Chen   班级 / Class: 10A

> 代码颜色 / Colour legend: **绿色 = 注释 / 解释**；**金 / 青 / 白 = 可执行代码**
> HTML 页面部件 · CSS 外观布局 · JavaScript 游戏大脑 · DOM 运行中可读改的页面

## 代码理论 / Quick theory（先读懂再动手）

- [x] **HTML** — 玩家分 / 电脑分 / 本轮分 / 目标分看板、骰子、ROLL 与 HOLD 按钮、状态行、结果弹窗
- [x] **CSS** — 金色主色 + 霓虹配色、骰子点数与掷骰动画、按钮 hover/禁用态、回合横幅高亮
- [x] **JavaScript** — 事件监听 → 改分数 → 判断输赢规则（`click → rollDice / playerHold`）
- [x] **DOM** — 运行中实时改 `textContent` / `className` / `disabled` / 骰子点数 `i.on`
- 读代码四问：① 什么触发？(`rollBtn` click → `playerRoll` → `rollDice`)
  ② 什么值在变？(`playerScore, botScore, turnScore, rollsThisTurn, turn`)
  ③ 检查什么条件？(`v === 1` 掷到 1、`total >= TARGET` 到 30 分、`botShouldHold()` 电脑阈值)
  ④ 跑完玩家看到什么？(骰子点数 + 本轮分变化 + 回合横幅 + 结果弹窗)

## 我会… / I can… (built + verified)

- [x] **use random dice values / 用随机骰子点数** — `rollDie()` = `1 + Math.floor(Math.random() * 6)`，500 次抽样全部为 1–6 整数
- [x] **manage turns / 管理回合** — `passTurn()` 在 HOLD 或掷到 1 后交换 `player ↔ bot`，并在电脑回合自动 `scheduleBotTurn()`
- [x] **create simple AI strategy / 创建简单 AI 策略** — `botShouldHold()` 阈值规则：EASY 10 分保存，HARD 15 分保存并能抢先到 30 分获胜
- [x] 风险选择：继续 ROLL 可能掷到 1 丢掉整轮，HOLD 稳稳存分 — 风险 risk 由玩家决定
- 中文关键词：骰子 dice · 风险 risk · 保存 hold

## 45 分钟流程 / Build path 逐段测试

- [x] **0–5 Launch** — 建 `L11` 文件夹，页面部件齐全（看板四项、骰子、ROLL/HOLD、状态行）
- [x] **12–25 Build A** — STEP1 看板 + 按钮；STEP2 掷随机 1–6，掷到 1 本轮分清零
- [x] **25–36 Build B** — STEP3 HOLD 存分并交出回合；STEP4 电脑阈值策略 + 先到 30 分判胜负
- [x] **36–41 Test like a player** — 掷到 1 / 保存 / 电脑回合 / 获胜 / 重来 五条路径全部试过
- [x] **自动化测试 43 项检查全部通过**，0 控制台报错（Node + headless Chrome）

## Rescue Mode + Level Up

- [x] **RESCUE** — 先玩 player-only Pig：HOLD 与掷到 1 后回合仍属于自己，电脑不出手；再点一次电脑回归决斗
- [x] **LEVEL UP: Easy / Hard bot** — `BOT_RULES` 双阈值：EASY 10 分保存；HARD 15 分保存，且 `botScore + turnScore ≥ 30` 立刻取胜利、能保护领先优势

## 测试记录 / Test Records

- [x] 开局前 — 看板 0 / 0 / 0 / 30，ROLL 与 HOLD 处于禁用态
- [x] 掷到 6 → `turnScore = 6`，骰面 6 点，`ROLLS THIS TURN = 1`
- [x] 掷到 1 → `turnScore = 0`、回合交给电脑、玩家按钮禁用、`busts = 1`
- [x] HOLD 6+5 → 玩家总分 11、本轮分归零、回合交给电脑；电脑行动后回合返回玩家
- [x] 电脑完整回合：掷到 12 保存 → `botScore = 12` → 交还玩家回合
- [x] 胜负判定：26 分 HOLD 掷到 4 → 30+ 分，弹出 `YOU WIN! / 你赢了`（含姓名班级、Rolls/Holds/Busts/Best turn）
- [x] 电脑取胜：BOT 27 分掷到 6 立刻保存 → 33 分，弹出 `BOT WINS! / 电脑赢了`
- [x] 阈值测试：HARD 14 分继续掷、15 分保存、27+3=30 立刻取胜；EASY 9 分继续掷、10 分保存
- [x] RESCUE：保存与掷到 1 都保持玩家回合，电脑全程不出手
- [x] 快捷键 `R` 掷骰、`H` 保存；RESET 清零并隐藏弹窗、START 恢复可用
- [x] **43/43 PASS · 控制台 0 报错**（headless Chrome 实测）
- [x] 截图 4 张：screenshot-1-idle / 2-mid / 3-final(玩家获胜) / 4-loss(电脑获胜)

## 最后一页提交要求 / Final 10 minutes turn-in

- [x] 1. 加上姓名与班级 — 游戏内 NAME=`Alex Chen`、CLASS=`10A`，结果弹窗会显示
- [x] 2. 正确保存/导出 — `index.html` + `style.css` + `script.js` 三个文件，双击 index.html 即可在 Chrome 运行
- [x] 3. 提交正确的文件 — `L11.zip`（内含 L11 文件夹全部文件）
- [x] 4. 同伴互查 / Partner check — 玩一局：掷骰影响本轮分 ✓ HOLD 存入总分 ✓ 掷到 1 清零 ✓ 先到 30 定胜负 ✓
- [x] **上交：ZIP L11 文件夹 + 决斗结果截图**（`screenshot-3-final.png` 玩家获胜、`screenshot-4-loss.png` 电脑获胜）

## I can… / 我会…

- [x] use random dice values / 使用随机骰子点数
- [x] manage turns / 管理玩家与电脑的回合
- [x] create simple AI strategy / 创建简单 AI 策略
