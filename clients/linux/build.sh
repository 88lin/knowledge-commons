#!/bin/sh
# CloudStudy · Linux 单文件便携版构建（zig 交叉编译，musl 静态链接）
# 用法: sh build.sh <study.html> [out]     （路径相对当前目录均可）
set -eu
HTML="${1:?用法: sh build.sh <study.html> [out]}"
OUT="${2:-out/CloudStudy}"
case "$HTML" in /*) ;; *) HTML="$(pwd)/$HTML" ;; esac
case "$OUT" in /*) ;; *) OUT="$(pwd)/$OUT" ;; esac
DIR="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$(dirname "$OUT")"
cp -f "$HTML" "$DIR/study.html"
cd "$DIR"
zig cc -target x86_64-linux-musl -O2 -s \
  -o "$OUT" launcher.c blob.S
echo "== 产物 =="
ls -la "$OUT"
file "$OUT" || true
