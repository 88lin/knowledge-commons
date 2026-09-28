# clients/windows —— Windows 单文件 EXE

**双击即用的绿色单文件**：内嵌 `study.html`（14MB），运行时释放到 `%TEMP%\CloudStudy.html`
并用默认浏览器打开；无需安装、无依赖。

## 构建

```sh
# 需 zig（0.13+）
sh clients/windows/build.sh study.html dist/CloudStudy-v3.0-windows-x64.exe
```

或云端：Actions → **build-windows**（ubuntu + zig 交叉编译，产物自动传 Release）。

## 说明

- 视频播放：EXE 为便携版（不含视频资产）；联网时可用站内在线视频，或使用
  Android/iOS full 版 / 仓库 `videos/`+`multiskill/` 目录本地配合同名文件夹离线播放。
- 同源：EXE 内嵌的 `study.html` 与 Web/APK/iOS 完全一致（`-DVIDEO_MODE=relative` 生成的统一版）。
