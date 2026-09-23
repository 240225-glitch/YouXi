# L08 — Memory Match vs Bot · 快速检查卡 / Quick Checklist

姓名 / Name: ____________________________   班级 / Class: ______________

## 我会… / I can… (built + verified)

- [x] 使用 `array` 存牌值（8 个符号 × 2 = 16 张卡，Fisher–Yates 洗牌）
- [x] 实现 match check：翻开两张卡比较符号 → 相同配对加分 / 不同自动翻回
- [x] 回合控制：玩家先手，每回合翻两张；配对成功可继续，失败换电脑回合（lock 防连点）
- [x] 电脑（bot）带记忆：`botSeen` Map 记住已见过的牌，先找记忆中的配对，再盲翻
- [x] 记分板实时更新：PLAYER MATCHES / PAIRS LEFT / BOT MATCHES
- [x] 8 对全部配对后弹出胜负：PLAYER WINS! / BOT WINS! / TIE GAME!

## 测试记录 / Test Records

- [x] 翻错测试：点同一张卡无效；翻开不匹配的两张 → 自动翻回、不加分
- [x] 配对测试：翻开相同两张 → 双方标记 matched、比分 +1、剩余对数 -1
- [x] 重开测试：NEW GAME / PLAY AGAIN 重置牌组、比分、记忆
- [x] 控制台/逻辑自动化测试（Node）26 项检查全部通过
- [x] 截图已保存（screenshot-1-idle / screenshot-2-mid / screenshot-3-final）

## 提交清单 / Turn-in

- [x] L08 项目文件夹已压缩为 ZIP
- [x] 文件夹内含：index.html、style.css、script.js、检查卡、截图 3 张
- [x] 打开 index.html 成绩：PLAYER MATCHES、PAIRS LEFT、BOT MATCHES，最终胜负弹窗
