#!/bin/sh
# CloudStudy · Windows 单文件 EXE 构建（zig 交叉编译）
# 用法: sh build.sh <study.html> [out.exe]     （路径相对当前目录均可）
set -eu
HTML="${1:?用法: sh build.sh <study.html> [out.exe]}"
OUT="${2:-out/CloudStudy.exe}"
case "$HTML" in /*) ;; *) HTML="$(pwd)/$HTML" ;; esac
case "$OUT" in /*) ;; *) OUT="$(pwd)/$OUT" ;; esac
DIR="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$(dirname "$OUT")"
cp -f "$HTML" "$DIR/study.html"
cd "$DIR"
zig cc -target x86_64-windows-gnu -O2 -s \
  -Wl,--subsystem,windows -Wl,--entry=WinMainCRTStartup \
  -o "$OUT" launcher.c blob.S -lshell32 -luser32
echo "== 产物 =="
ls -la "$OUT"
file "$OUT" || true
