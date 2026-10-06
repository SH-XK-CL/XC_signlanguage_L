# 手语翻译 · 离线版 v6.0.0（重建）

以**中国标准手语**为主的离线 HTML Web 端手语翻译应用，支持 PWA 安装与离线使用。
本项目为原 v6.0.0 的**重建版本**（原工程源文件在本机遗失后从规格重建），保留核心能力并补齐文档。

## 功能概览
- **离线识别**：基于 MediaPipe Hands（21 点手部关键点）+ 规则化识别器，实时识别单手数字 0–9、你好、谢谢、我、你、好、停、和平、不 等。
- **手势词典**：内置 **137 条**中国标准手语词条，按 19 个分类组织，支持搜索与语音朗读。
- **文本互译**：中文句子 → 手语词条序列（最长匹配分词），并支持原文中文语音输出（Web Speech API）。
- **训练模块**：用户可录入自定义手势样本（存于本机 localStorage），扩展可识别手势。
- **PWA 离线**：manifest + Service Worker，首次联网后完全离线可用；可“添加到主屏幕”安装。

## 目录结构
```
手语翻译项目_v6.0.0/
├── index.html              主界面（识别/词典/翻译/训练 四页）
├── manifest.webmanifest    PWA 清单
├── sw.js                  Service Worker（离线缓存）
├── css/style.css          界面样式（移动端友好，浅色主题）
├── js/
│   ├── dictionary.js      137 条手势词典数据（数据底座）
│   ├── recognizer.js      规则化手势识别（手指伸展状态 + 签名匹配）
│   ├── translator.js      中文↔手语 翻译（最长匹配分词）
│   ├── tts.js             语音输出（Web Speech 中文）
│   ├── camera.js          摄像头 + MediaPipe 集成（ESM，CDN）
│   └── app.js             主交互逻辑
├── libs/mediapipe/        离线模型/库存放位（见下“离线部署”）
├── assets/icons/          PWA 图标（SVG）
├── android/               安卓封装说明（Capacitor/PWABuilder）
├── ios/                   iOS 封装说明
└── docs/                  本文档
```

## 识别模型（神经网络）
项目内置一个**可训练的神经网络手势识别模型**，替代/补充规则化识别：

- `js/model.js`：无依赖前馈神经网络（126 维归一化 landmarks → 类别），含特征提取、训练、推理、序列化，浏览器与 Node 通用。
- `model.json`：用合成数据预训练的初始模型（12 个手形类别：零/一/二/三/四/五/六/七/八/我/好/不好，合成测试集 100% 准确率）。
- `tools/train.js`：Node 训练脚本，基于词典签名生成合成样本并重训/导出 `model.json`（`node tools/train.js`）。
- **App「训练」页（真实使用路径）**：开启摄像头 → 输入手势名 →「采集10帧」→「训练模型」即在浏览器内训练并立即接管识别；「保存模型」写入本机(localStorage)并下载 `gesture_model.json`，「加载已保存」恢复。所有数据留在用户设备，无需联网。

> 说明：合成预训练模型仅用于验证管线；真实识别请在 App 内用本人手势采集样本重训，不同角度/距离多采几组可显著提升准确率。

## 本地运行
1. 因浏览器安全限制，摄像头与 Service Worker 需在 `http(s)` 或 `localhost` 下运行。
   - 简单方式：`python -m http.server 8080` 后访问 `http://localhost:8080`
   - 直接双击 `index.html`（file://）可浏览词典/翻译，但摄像头与离线缓存不可用。
2. 首次进入「识别」页需联网以加载 MediaPipe（之后由 SW 缓存可离线）。

## 离线部署（彻底离线）
默认从 CDN 加载 MediaPipe wasm 与 `hand_landmarker.task` 模型。若要**完全离线**：
1. 下载并放入 `libs/mediapipe/`：
   - wasm 包：`https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm`
   - 模型：`https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`
2. 修改 `js/camera.js` 中 `WASM_BASE` / `MODEL_URL` 指向本地路径。
3. 通过本地 http 服务器部署（见上）。

## 已知短板与三大瓶颈（与原项目一致）
1. **双手同时识别**：当前识别器支持双手计数，但缺乏双手协同语义（如“爱”“家”的双手配合）的 ML 识别，仍需规则扩展。
2. **动态手势识别**：挥手、摇头等动态手势目前靠 `wave/chin/shake` 等标志位预留，尚未接入时序模型（如 LSTM / MediaPipe 动作分类器）。
3. **翻译准确度**：采用词典最长匹配分词，无语法/语境理解；未登录词直接标记为“无对应手语”。训练模块可缓解但非模型级提升。

> 说明：识别为**规则化**（几何特征）而非训练好的分类模型，故仅覆盖带 `rec:true` 签名的词条；其余词条用于词典查阅与文本翻译。

## 安卓 / iOS 构建
- **Android**：用 `android/` 下的说明，通过 Capacitor 或 Microsoft PWABuilder 将本 PWA 封装为 `.apk`/`.aab`，无需重写原生代码。
- **iOS**：Safari 支持“添加到主屏幕”直接安装 PWA；如需上架 App Store，可用 PWABuilder / Capacitor 生成 iOS 工程（需 macOS + 开发者账号）。
- 详见 `android/README.md` 与 `ios/README.md`。
