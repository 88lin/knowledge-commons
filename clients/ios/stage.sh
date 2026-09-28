#!/bin/sh
# stage.sh <lite|full> —— 将内容资源铺入 clients/ios/Resources/（供 Xcode 打包）
#   lite : 仅 study.html（约 15MB，App 体积小）
#   full : study.html + videos/ + multiskill/ 视频与模拟训练（约 500MB，全离线）
set -eu
V="${1:-lite}"
IOS="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$IOS/../.." && pwd)"
cd "$ROOT"

rm -rf "$IOS/Resources"
mkdir -p "$IOS/Resources/videos" "$IOS/Resources/multiskill"

# 1) 单文件学习中心
cp -f study.html "$IOS/Resources/study.html"

# 2) full：视频课 + 全技能库视频与模拟训练（保持仓库内相对路径结构）
if [ "$V" = "full" ]; then
  cp -R videos/. "$IOS/Resources/videos/"
  find multiskill \( -name '*.mp4' -o -name '模拟训练.html' \) -print | while IFS= read -r f; do
    mkdir -p "$IOS/Resources/$(dirname "$f")"
    cp "$f" "$IOS/Resources/$(dirname "$f")/"
  done
fi

echo "== staged ($V) =="
du -sh "$IOS/Resources" "$IOS/Resources"/*
