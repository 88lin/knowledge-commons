#!/bin/sh
# CloudStudy · macOS 便携 .app 构建（swiftc 直编，Apple Silicon + Intel 通用二进制）
# 用法: sh build.sh <study.html> [out.zip]   （须在 macOS 上运行）
set -eu
HTML="${1:?用法: sh build.sh <study.html> [out.zip]}"
OUT="${2:-dist/CloudStudy-macos.zip}"
case "$HTML" in /*) ;; *) HTML="$(pwd)/$HTML" ;; esac
case "$OUT" in /*) ;; *) OUT="$(pwd)/$OUT" ;; esac
DIR="$(cd "$(dirname "$0")" && pwd)"
BUILD="$DIR/build"
APP="$BUILD/CloudStudy.app"

rm -rf "$BUILD"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources"
cp -f "$HTML" "$APP/Contents/Resources/study.html"
cp -f "$DIR/Info.plist" "$APP/Contents/Info.plist"

echo "== 编译 arm64 =="
swiftc -O -target arm64-apple-macosx12.0 "$DIR/main.swift" -o "$APP/Contents/MacOS/CloudStudy-arm64"
echo "== 编译 x86_64 =="
swiftc -O -target x86_64-apple-macosx12.0 "$DIR/main.swift" -o "$APP/Contents/MacOS/CloudStudy-x64"
echo "== 合并通用二进制 =="
lipo -create \
  "$APP/Contents/MacOS/CloudStudy-arm64" \
  "$APP/Contents/MacOS/CloudStudy-x64" \
  -output "$APP/Contents/MacOS/CloudStudy"
rm -f "$APP/Contents/MacOS/CloudStudy-arm64" "$APP/Contents/MacOS/CloudStudy-x64"

echo "== ad-hoc 签名 =="
codesign --force -s - "$APP"

echo "== 打包 zip =="
mkdir -p "$(dirname "$OUT")"
rm -f "$OUT"
# ditto 保留符号链接与资源分叉，Finder 解压体验最佳
ditto -c -k --keepParent "$APP" "$OUT"
echo "== 产物 =="
ls -la "$OUT"
