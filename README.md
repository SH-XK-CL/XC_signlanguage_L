# 手语翻译 · 离线版 v6.0.0

以**中国标准手语**为主的离线 HTML Web 端手语翻译应用，支持 PWA 安装与离线使用。

## 功能
- 离线识别：MediaPipe Hands（21 点手部关键点）+ 规则化识别 / 可训练神经网络模型
- 手势词典：内置 151 条中国标准手语词条（19 个分类，可搜索、语音朗读）
- 文本互译：中文句子 → 手语词条序列；中文语音输出（Web Speech API）
- 训练模块：摄像头采集标注样本，浏览器内训练模型，数据全部留在本机
- PWA 离线：manifest + Service Worker，首次联网后离线可用

## 快速开始
```bash
python -m http.server 8080
# 浏览器打开 http://localhost:8080
```
> 摄像头与 Service Worker 需在 http(s)/localhost 下运行；直接双击 index.html 仅可浏览词典与翻译。

## 目录
- `js/dictionary.js` 手势词典数据
- `js/recognizer.js` 规则化识别
- `js/model.js` 可训练神经网络（浏览器/Node 通用）
- `js/camera.js` MediaPipe 集成
- `tools/train.js` Node 训练脚本（生成 model.json）

## 说明
`model.json` 为合成数据预训练模型，用于验证管线；真实识别请在 App「训练」页采集本人手势样本后重训。详见 `docs/README.md`。

## 许可证

本项目采用 **GNU General Public License v3.0（GPL-3.0）**。详见 [LICENSE](./LICENSE)。
