#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="/app"
LUMINA_DIR="$ROOT_DIR/_uploaded_src/lumina"

SKIP_GRADLE=0

for arg in "$@"; do
  case "$arg" in
    --skip-gradle)
      SKIP_GRADLE=1
      ;;
    *)
      echo "Unknown option: $arg"
      echo "Usage: $0 [--skip-gradle]"
      exit 1
      ;;
  esac
done

step() {
  echo ""
  echo "==> $1"
}

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "ERROR: Required command not found: $1"
    exit 1
  fi
}

require_cmd node

# Prefer JDK 21 for Android Gradle Plugin 8.13+ compatibility.
if [[ -x "/opt/jdk-21/bin/java" ]]; then
  export JAVA_HOME="/opt/jdk-21"
  export PATH="$JAVA_HOME/bin:$PATH"
fi

step "Build Lumina web bundle"
cd "$LUMINA_DIR"
node ./node_modules/typescript/bin/tsc -b
node ./node_modules/vite/bin/vite.js build

step "Sync web bundle into Android assets"
ANDROID_PUBLIC_DIR="$LUMINA_DIR/android/app/src/main/assets/public"
mkdir -p "$ANDROID_PUBLIC_DIR"
cp -R "$LUMINA_DIR/dist"/* "$ANDROID_PUBLIC_DIR"/

if [[ "$SKIP_GRADLE" -eq 0 ]]; then
  step "Build Android APK (Gradle debug)"
  if command -v java >/dev/null 2>&1; then
    cd "$LUMINA_DIR/android"
    ./gradlew assembleDebug
    echo "APK output path: $LUMINA_DIR/android/app/build/outputs/apk/debug/app-debug.apk"
  else
    echo "ERROR: Java is not installed (JAVA_HOME/java missing)."
    echo "Hint: rerun with --skip-gradle for JS bundle + health only."
    exit 1
  fi
else
  echo "Skipping Gradle APK build (--skip-gradle)."
fi

step "Artifact checks"
if [[ ! -f "$LUMINA_DIR/dist/index.html" ]]; then
  echo "ERROR: Missing built web bundle index.html"
  exit 1
fi
echo "OK: Web bundle present at $LUMINA_DIR/dist/index.html"

if [[ "$SKIP_GRADLE" -eq 0 ]]; then
  APK_PATH="$LUMINA_DIR/android/app/build/outputs/apk/debug/app-debug.apk"
  if [[ ! -f "$APK_PATH" ]]; then
    echo "ERROR: APK not found at expected path: $APK_PATH"
    exit 1
  fi
  echo "OK: APK present at $APK_PATH"
fi

echo ""
echo "✅ Backend-free APK CI build completed successfully."
