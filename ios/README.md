# iOS 构建说明（手语翻译 v6.0.0）

iOS 对 PWA 支持良好，无需上架即可使用；如需 App Store 分发则需封装。

## 方式一：Safari “添加到主屏幕”（零成本）
1. 用 Safari 打开已部署的 https 站点。
2. 点击分享 → “添加到主屏幕”。
3. 桌面出现图标，点击即以独立 App 体验（含离线缓存）。

## 方式二：PWABuilder / Capacitor 生成 iOS 工程（需上架时）
- 前置：macOS + Xcode + Apple 开发者账号（$99/年）。
- PWABuilder 选择 **iOS** 平台，下载 Xcode 工程，按提示签名后归档上传 App Store。
- 或 Capacitor：`npx cap add ios && npx cap sync && npx cap open ios`。

## 注意事项
- iOS Safari 的 Web Speech API（语音输出）在部分版本需用户先交互才可用；本应用在点击「朗读」后触发，已规避。
- 摄像头：需 https 环境，localhost 调试除外。
- 离线缓存：iOS 对 SW 支持完整，首屏联网一次后即可离线。
- 双手/动态手势的 ML 识别尚未实现，见 docs/README.md 瓶颈说明。
