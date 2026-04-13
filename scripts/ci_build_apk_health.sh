#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="/app"
FRONTEND_DIR="$ROOT_DIR/frontend"
BACKEND_DIR="$ROOT_DIR/backend"
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

env_value() {
  local key="$1"
  local file="$2"
  grep -E "^${key}=" "$file" | tail -n 1 | cut -d '=' -f2- | tr -d '"'
}

health_check() {
  local url="$1"
  local code
  code=$(curl -sS -o /dev/null -w "%{http_code}" "$url")
  if [[ "$code" != "200" ]]; then
    echo "ERROR: Health check failed for $url (HTTP $code)"
    exit 1
  fi
  echo "OK: $url (HTTP $code)"
}

require_cmd curl
require_cmd node
require_cmd npx

# Prefer JDK 21 for Android Gradle Plugin 8.13+ compatibility.
if [[ -x "/opt/jdk-21/bin/java" ]]; then
  export JAVA_HOME="/opt/jdk-21"
  export PATH="$JAVA_HOME/bin:$PATH"
fi

if [[ ! -f "$FRONTEND_DIR/.env" ]]; then
  echo "ERROR: Missing $FRONTEND_DIR/.env"
  exit 1
fi

BACKEND_URL="$(env_value EXPO_PUBLIC_BACKEND_URL "$FRONTEND_DIR/.env")"
if [[ -z "$BACKEND_URL" ]]; then
  echo "ERROR: EXPO_PUBLIC_BACKEND_URL missing in frontend/.env"
  exit 1
fi

step "Build Lumina web bundle"
cd "$LUMINA_DIR"
node ./node_modules/typescript/bin/tsc -b
node ./node_modules/vite/bin/vite.js build --base /api/lumina/

step "Sync Lumina dist to backend static serving path"
rm -rf "$BACKEND_DIR/lumina_dist"
cp -R "$LUMINA_DIR/dist" "$BACKEND_DIR/lumina_dist"

step "Export Android JS bundle (Expo)"
cd "$FRONTEND_DIR"
npx expo export --platform android --no-bytecode --clear

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

step "Health checks"
health_check "$BACKEND_URL/"
health_check "$BACKEND_URL/api/"
health_check "$BACKEND_URL/api/lumina/"

echo ""
echo "✅ CI build and health checks completed successfully."
