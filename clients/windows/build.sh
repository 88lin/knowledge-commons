#!/bin/sh
# CloudStudy · Windows 单文件 EXE 构建（zig 交叉编译）
# 用法: sh build.sh <study.html> [out.exe]
#   例:  sh build.sh study.html dist/CloudStudy-v3.0-windows-x64.exe
set -eu
HTML="${1:?用法: sh build.sh <study.html> [out.exe]}"
OUT="${2:-out/CloudStudy.exe}"
cd "$(dirname "$0")"
mkdir -p out "$(dirname "$OUT")"
cp -f "$HTML" study.html
zig cc -target x86_64-windows-gnu -O2 -s \
  -Wl,--subsystem,windows -Wl,--entry=WinMainCRTStartup \
  -o "$OUT" launcher.c blob.S -lshell32 -luser32
echo "== 产物 =="
ls -la "$OUT"
file "$OUT" || true
