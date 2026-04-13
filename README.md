# Backend-Free APK CI Script

Run one command to build a backend-free APK:

```bash
/app/scripts/ci_build_apk_health.sh
```

If Java/Gradle is unavailable in the environment, run:

```bash
/app/scripts/ci_build_apk_health.sh --skip-gradle
```

What it does:
- Builds Lumina web bundle (`/app/_uploaded_src/lumina`)
- Copies bundled web assets into Android app assets directory
- Optionally builds debug APK via Gradle
- Verifies generated artifact paths locally

APK output:
- `/app/_uploaded_src/lumina/android/app/build/outputs/apk/debug/app-debug.apk`
