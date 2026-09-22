# L07 — Reaction Time Bot · 快速检查卡 / Quick Checklist

姓名 / Name: ____________________________   班级 / Class: ______________

## 我会… / I can… (built + verified)

- [x] 使用 `setTimeout()` 做延迟事件（随机等待 1.5–4 秒后出现 GO）
- [x] 使用 `Date.now()` 测量反应时间（GO 到点击的毫秒数）
- [x] 生成电脑（bot）成绩并比较玩家与电脑谁更快
- [x] 处理过早点击：GO 之前点击 → FALSE START（犯规）提示，本轮作废
- [x] 场地（禁用按钮）防止作弊：回合进行中 START 被禁用，回合之间反应键被禁用

## 测试记录 / Test Records

- [x] 过早点击测试：点击 START 后立刻按反应键 → 显示 FALSE START!，玩家栏显示"犯规"
- [x] 正常回合测试：连续完成 5 轮真实回合，每轮显示玩家成绩、电脑成绩与胜负比较
- [x] 重开测试：5 轮结束后 PLAY AGAIN 重置比分、轮数、历史圆点
- [x] 控制台/逻辑自动化测试（Node）34 项检查全部通过
- [x] 截图已保存（screenshot-1-idle / screenshot-2-mid-game / screenshot-3-game-over）

## 提交清单 / Turn-in

- [x] L07 项目文件夹已压缩为 ZIP
- [x] 文件夹内含：index.html、style.css、script.js、检查卡、截图 3 张
- [x] 打开 index.html 成绩：玩家时间、电脑时间、PLAYER 胜 / BOT 胜 / 平局