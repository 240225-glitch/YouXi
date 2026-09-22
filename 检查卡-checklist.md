# L05 — Guess the Number Duel · 快速检查卡 / Quick Checklist

姓名 / Name: ____________________________   班级 / Class: ______________

## 我会… / I can… (built + verified)

- [x] 使用 `Math.random()` 生成随机秘密数字（1–50）
- [x] 使用 `if / else` 比较判断太高、太低或正确
- [x] 使用尝试计数器限制回合数（最多 7 次）
- [x] 根据尝试次数判定胜负：≤7 次玩家赢，>7 次电脑赢
- [x] 添加电脑 mood 消息（自信/紧张/震惊/认输）
- [x] 显示比分板和历史记录
- [x] 重置/新游戏功能

## 测试记录 / Test Records

- [x] 输入过低数字 → 显示 "TOO LOW ↑"
- [x] 输入过高数字 → 显示 "TOO HIGH ↓"
- [x] 输入正确数字 → 显示 "YOU GOT IT!" + 玩家赢
- [x] 用完 7 次机会 → 显示 "BOT WINS!" + 电脑赢
- [x] mood 信息随尝试次数变化（自信→紧张→震惊）
- [x] 无效输入（0、51、abc）→ 显示错误提示
- [x] 重置后数字改变、尝试次数归零
- [x] Node 自动化测试 29 项全部通过
- [x] 截图已保存（screenshot-1-idle / screenshot-2-win / screenshot-3-lose）

## 提交清单 / Turn-in

- [x] L05 项目文件夹已压缩为 ZIP
- [x] 文件夹内含：index.html、style.css、script.js、检查卡、截图 3 张
- [x] 打开 index.html 输入数字测试：提示太高/太低/正确