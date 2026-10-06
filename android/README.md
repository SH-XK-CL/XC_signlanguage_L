# Android 构建说明（手语翻译 v6.0.0）

本应用为纯前端 PWA，无需重写原生代码即可封装为 Android 应用。两种方式任选：

## 方式一：PWABuilder（最简单，推荐）
1. 将本目录部署到任意 https 站点（或用 `npx serve` + 内网穿透临时测试）。
2. 打开 https://www.pwabuilder.com ，输入站点地址。
3. 按向导生成 **Android (APK / AAB)**，下载并安装到手机。
> 优点：零原生代码；生成的 APK 即带离线缓存与“添加到主屏”体验。

## 方式二：Capacitor（可扩展原生能力）
```bash
npm init -y
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init 手语翻译 com.example.slt app
# 将本目录所有文件复制到 ./app/www （或把 webDir 指向本目录）
npx cap add android
npx cap sync
npx cap open android   # 用 Android Studio 打开，连设备运行 / 打包
```
> 若需调用原生相机之外的能力（如后台、推送），可在 Capacitor 层添加插件。

## 注意事项
- 摄像头权限：Android 需 `CAMERA` 权限，PWABuilder/Capacitor 已默认配置。
- 离线：确保 Service Worker 与本地资源一同打包，首屏联网一次后即可离线。
- 包体积：主要取决于 MediaPipe 模型（约 8MB），整体 APK 通常 < 15MB。
