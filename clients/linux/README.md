# clients/linux —— Linux 单文件便携版

与 Windows EXE 同构：内嵌 `study.html`，运行时释放到
`~/.cache/knowledge-commons/study.html` 并用 `xdg-open` 打开默认浏览器。
musl 静态链接，任意发行版（glibc / musl）双击即用，零依赖。

## 构建

```sh
# 需 zig 0.13+
sh clients/linux/build.sh study.html dist/CloudStudy-linux-x64
```

或云端：Actions → **build-linux**（ubuntu + zig 交叉编译，产物自动传 Release）。

## 说明

- 产物为单个 ELF 可执行文件；首次运行会释放学习中心到用户缓存目录
- 视频/图解走仓库 `videos/` + `multiskill/` 目录或站内在线源，与 EXE 版策略一致
- 内嵌内容与 Web / APK / iOS 完全同源（同一份 `study.html`）
