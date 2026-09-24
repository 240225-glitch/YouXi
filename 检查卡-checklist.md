# L09 — Typing Speed Duel · 快速检查卡 / Quick Checklist

姓名 / Name: ____________________________   班级 / Class: ______________

## 我会… / I can… (built + verified)

- [x] 读取输入文字：`input` 事件在打字时实时运行，读到玩家输入的字符串
- [x] 计时器：第一个字母按下时 `Date.now()` 开始计时，打完/提交时停止
- [x] 字符串比较：输入与提示句逐字符比对（绿=对 / 红=错 / 青色光标=当前位）
- [x] 计算成绩：WPM = (正确字符 ÷ 5) ÷ 分钟数；准确率 = 正确字符 ÷ 提示长度
- [x] 电脑对比：随机生成 bot WPM（35–74），打完后比较 → YOU WIN! / BOT WINS! / TIE GAME!
- [x] 多条提示：4 条随机句子，连续两次不重复（Level Up: three random prompts ✓）
- [x] 明确错误反馈：空输入 → EMPTY INPUT!；没打完 → KEEP GOING! 还差 N 个字符

## 测试记录 / Test Records

- [x] 完美句子测试：输入完全匹配 → 自动停止计时、准确率 100%、弹出结果
- [x] 错误测试：打错字符出现红色高亮；打满长度但有错 → 准确率 < 100%
- [x] 空输入测试：未打字直接提交 → EMPTY INPUT! 红色错误提示，不结算
- [x] 控制台/逻辑自动化测试（Node）62 项检查全部通过
- [x] 截图已保存（screenshot-1-idle / screenshot-2-mid / screenshot-3-final）

## 提交清单 / Turn-in

- [x] L09 项目文件夹已压缩为 ZIP
- [x] 文件夹内含：index.html、style.css、script.js、检查卡、截图 3 张
- [x] 打开 index.html 成绩：WPM、TIME、ACCURACY、BOT WPM，最终胜负弹窗
