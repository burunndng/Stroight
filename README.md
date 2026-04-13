# CI APK + Health Script

Run one command to build and validate deployment health:

```bash
/app/scripts/ci_build_apk_health.sh
```

If Java/Gradle is unavailable in the environment, run:

```bash
/app/scripts/ci_build_apk_health.sh --skip-gradle
```

What it does:
- Builds Lumina web bundle (`/app/_uploaded_src/lumina`)
- Syncs static bundle to backend (`/app/backend/lumina_dist`)
- Exports Android JS bundle via Expo
- Optionally builds debug APK via Gradle
- Verifies health endpoints (`/`, `/api/`, `/api/lumina/`)
