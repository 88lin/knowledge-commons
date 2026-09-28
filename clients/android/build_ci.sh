#!/bin/sh
# CloudStudy · Android APK 云端构建脚本（GitHub Actions ubuntu 运行器）
# 用法: sh clients/android/build_ci.sh lite|full|both
# 依赖: 仓库内 study.html（统一内容）+ videos/ + multiskill/ + tools/ 材料 + secrets 签名
set -eu
VARIANT="${1:-lite}"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
mkdir -p dist build

# ---------- 定位 Android SDK 工具 ----------
SDK="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-/usr/local/lib/android/sdk}}"
BT="$(ls -d "$SDK"/build-tools/* 2>/dev/null | sort -V | tail -1)"
PLATFORM="$(ls -d "$SDK"/platforms/android-* 2>/dev/null | sort -V | tail -1)"
AAPT2="$BT/aapt2"; ZIPALIGN="$BT/zipalign"; APKSIGNER="$BT/apksigner"
ANDROID_JAR="$PLATFORM/android.jar"
echo "SDK=$SDK"; echo "build-tools=$BT"; echo "platform=$PLATFORM"
[ -x "$AAPT2" ] || { echo "FATAL: aapt2 未找到"; exit 1; }
[ -f "$ANDROID_JAR" ] || { echo "FATAL: android.jar 未找到"; exit 1; }
test -f study.html || { echo "FATAL: 缺少 study.html"; exit 1; }

echo "$ANDROID_KS_B64" | base64 -d > build/ks.jks

build_one() {
  V="$1"
  echo "======== 构建 $V ========"
  rm -rf build/ci && mkdir -p build/ci/assets build/ci/res
  cp tools/apk-template/AndroidManifest.xml build/ci/
  cp -r tools/apk-template/smali build/ci/smali
  cp -r tools/apk-template/res/. build/ci/res/
  cp study.html build/ci/assets/study.html

  if [ "$V" = "full" ]; then
    mkdir -p build/ci/assets/videos
    cp -R videos/. build/ci/assets/videos/
    find multiskill \( -name '*.mp4' -o -name '模拟训练.html' \) -print | while IFS= read -r f; do
      mkdir -p "build/ci/assets/$(dirname "$f")"
      cp "$f" "build/ci/assets/$(dirname "$f")/"
    done
  else
    # lite：文档 + 图解 gallery + 50 个模拟训练（不含视频，约 +6MB）
    mkdir -p build/ci/assets/videos/gallery
    cp -R videos/gallery/. build/ci/assets/videos/gallery/ 2>/dev/null || true
    find multiskill -name '模拟训练.html' -print | while IFS= read -r f; do
      mkdir -p "build/ci/assets/$(dirname "$f")"
      cp "$f" "build/ci/assets/$(dirname "$f")/"
    done
  fi
  echo "[$V] assets = $(du -sh build/ci/assets | cut -f1)"

  echo "[$V] smali -> dex"
  java -jar tools/jars/smali.jar assemble build/ci/smali -o build/ci/classes.dex
  ls -la build/ci/classes.dex

  echo "[$V] aapt2 compile + link"
  ( cd build/ci && "$AAPT2" compile --dir res -o res.zip \
    && "$AAPT2" link -o out.apk -I "$ANDROID_JAR" --manifest AndroidManifest.xml -0 mp4 -A assets res.zip )
  ls -la build/ci/out.apk

  echo "[$V] merge dex"
  python3 tools/add_dex.py build/ci/out.apk build/ci/classes.dex build/ci/unsigned.apk

  echo "[$V] zipalign + sign"
  "$ZIPALIGN" -f 4 build/ci/unsigned.apk build/ci/aligned.apk
  "$APKSIGNER" sign --ks build/ks.jks \
    --ks-pass "pass:$ANDROID_KS_PASS" --key-pass "pass:$ANDROID_KS_PASS" \
    --ks-key-alias cloudstudy \
    --out "dist/CloudStudy-v3.0-android-$V.apk" build/ci/aligned.apk
  "$APKSIGNER" verify "dist/CloudStudy-v3.0-android-$V.apk"
  ls -la "dist/CloudStudy-v3.0-android-$V.apk"
}

case "$VARIANT" in
  lite) build_one lite ;;
  full) build_one full ;;
  both) build_one lite; build_one full ;;
  *) echo "未知 variant: $VARIANT"; exit 1 ;;
esac

rm -f build/ks.jks
echo "===== dist ====="
ls -la dist/
