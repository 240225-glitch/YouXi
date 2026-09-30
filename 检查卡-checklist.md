# L10 — Math Blaster Boss · 快速检查卡 / Quick Checklist

姓名 / Name: Alex Chen   班级 / Class: 10A

> 代码颜色 / Colour legend: **绿色 = 注释 / 解释**；**青 / 蓝 / 紫 / 白 = 可执行代码**
> HTML 页面部件 · CSS 外观布局 · JavaScript 游戏大脑 · DOM 运行中可读改的页面

## 代码理论 / Quick theory（先读懂再动手）

- [x] **HTML** — 题目显示、答案输入、FIRE 提交按钮、倒计时、BOSS/玩家血条
- [x] **CSS** — 霓虹配色、血条宽度过渡、按钮 hover/禁用态、≤5 秒倒计时闪烁
- [x] **JavaScript** — 事件监听 → 改分数 → 判断输赢规则
- [x] **DOM** — 运行中实时改 `textContent` / `style.width` / `className`
- 读代码四问：① 什么触发？(`startBtn` click → `startGame`)
  ② 什么值在变？(`bossHp, playerHp, streak, timeLeft`)
  ③ 检查什么条件？(`typed === state.question.answer`, `timeLeft <= 0`)
  ④ 跑完玩家看到什么？(血条变化 + 状态行 + 结果弹窗)

## 我会… / I can… (built + verified)

- [x] 生成随机题目：`makeQuestion()` 加法 + 减法（减法永不为负），300 次抽样全对
- [x] 校验数字答案：`parseAnswer()` 去空格去杂字符 → `Number`；非数字 → `TYPE A NUMBER`
- [x] 使用游戏状态变量：`bossHp / playerHp / streak / bestStreak / hits / timeLeft / running / over`
- [x] 函数 `function`：每次答对调用 `nextQuestion()` 生成新题
- [x] 答对伤害 BOSS（10 + 连击加成，最高 +10）；答错伤害玩家 −10 并清空连击
- [x] 30 秒倒计时 `setInterval(tick, 1000)`；到 0 结束游戏，BOSS 血量决定胜负
- [x] 连击 streak：答对 +1、答错归零，最佳连击写进结果
- 中文关键词：数学 math · 生命 health · 连击 streak

## 45 分钟流程 / Build path 逐段测试

- [x] **0–5 Launch** — 建 `L10` 文件夹，页面部件齐全（题目、输入、FIRE、计时、BOSS 血量）
- [x] **12–25 Build A** — 测试：STEP1 6 项 + STEP2 10 项全 PASS（随机加减、题目格式、答案数学全对）
- [x] **25–36 Build B** — 测试：STEP3 8 项 + STEP4 6 项全 PASS（血量、连击、超时判负）
- [x] **36–41 Test like a player** — 答对 / 答错 / 超时 三种路径全部试过
- [x] **自动化测试 51 项检查全部通过**，0 控制台报错（Node + headless Chrome）

## Rescue Mode + Level Up

- [x] **RESCUE** — 先出 5 道固定题（3+4, 9−5, 6+7, 12−8, 5+5），答完自动转随机；按钮可开关
- [x] **LEVEL UP: BOSS MODE** — 乘法 `a × b`，30% 概率升级题 `a × b + c`；可切回 `+ −`

## 测试记录 / Test Records

- [x] 答对 → BOSS 血条下降，`HIT! -14 BOSS HP · 14 - 5 = 9`
- [x] 答错 → 玩家 −10、连击归零，`MISS! -10 YOUR HP · answer was 8`
- [x] 空/非数字输入 → 不扣血、红字提示 `TYPE A NUMBER`
- [x] 30 秒到点 → 弹出 `TIME UP! BOSS WINS`（BOSS 血未清零即失败）
- [x] BOSS 血归零 → `BOSS DEFEATED!`；玩家血归零 → `BOSS WINS!`
- [x] PLAY AGAIN 恢复 100/100 与 30 秒，弹窗关闭
- [x] 截图 4 张：screenshot-1-idle / 2-mid / 3-final(boss defeat) / 4-loss

## 最后一页提交要求 / Final 10 minutes turn-in

- [x] 1. 加上姓名与班级 — 游戏内 NAME=`Alex Chen`、CLASS=`10A`，结果弹窗会显示
- [x] 2. 正确保存/导出 — `index.html` + `style.css` + `script.js` 三个文件，双击 index.html 即可运行
- [x] 3. 提交正确的文件 — `L10.zip`（内含 L10 文件夹全部文件）
- [x] 4. 同伴互查 / Partner check — 玩一局：题目出现 ✓ 答案影响血量 ✓ 计时结束定胜负 ✓
- [x] **上交：ZIP L10 文件夹 + BOSS 击败/失败截图**（`screenshot-3-final.png` 打败 BOSS、`screenshot-4-loss.png` 玩家失败）

## I can… / 我会…

- [x] generate random questions / 生成随机题目
- [x] validate number answers / 校验数字答案
- [x] use game-state variables / 使用游戏状态变量
