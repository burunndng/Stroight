# Lumina Stabilization PRD

## Problem Statement
Harden and complete the uploaded Lumina mobile-web strobe app against critical runtime bugs and missing safety/performance controls, then implement all requested phases (0→4): torch reliability, screen strobe guards, lifecycle handling, Android hardening, sync polish, and expanded tests.

## Architecture
- Frontend: React + TypeScript (Vite), Capacitor wrapper for Android WebView
- Native Android: `MainActivity.java`, `AndroidManifest.xml`, Gradle release config
- Core engines:
  - `src/lib/strobe.ts` (torch/screen strobe timing and fallback)
  - `src/lib/audio.ts` (session audio generation and cleanup)
  - `src/hooks/useTorch.ts` (camera stream/track lifecycle)

## User Personas
- Primary: users running guided eyes-closed strobe sessions on Android phones
- Secondary: advanced users selecting higher-frequency presets (e.g., Gamma 40)

## Core Requirements (Static)
1. Session must not silently break on invalid pattern math (`NaN`, zero/invalid Hz).
2. Torch failures must be detected at runtime and gracefully fall back to screen mode.
3. App must handle background/foreground lifecycle safely (no dead session state).
4. Android must prevent screen sleep during active session.
5. Camera resources must be fully released after session.
6. Release build should be hardened (R8/ProGuard, scoped permissions, network security config).
7. Test coverage must include guards and fallback paths.

## Implemented (2026-04-13)
- Phase 0 (Critical):
  - `applyTorch` now returns `Promise<boolean>` and no longer swallows failures silently.
  - Added torch failure counter with auto-fallback after 3 consecutive failures.
  - Added NaN/invalid guard in `createScreenStrobe`.
  - Added `FLAG_KEEP_SCREEN_ON` in Android `MainActivity`.
  - Fixed stream leak in `useTorch` by storing `MediaStream` and stopping all tracks on release/unmount.
- Phase 1 (Performance/Lifecycle):
  - Removed high-frequency `screenOn` React state re-renders from Session.
  - Switched strobe visual updates to refs/direct style updates.
  - Added `visibilitychange` handling: hidden → pause/cleanup; visible → navigate Home.
  - Added user banner: "Torch unavailable — using screen mode".
- Phase 2 (Safety):
  - Session duration capped at 30 minutes.
  - Session timer now uses `performance.now()` aligned with strobe timing.
  - Scoped WebView permission grants to `RESOURCE_VIDEO_CAPTURE` only.
- Phase 3 (Build/Polish):
  - Enabled R8/ProGuard + resource shrinking in release build.
  - Removed unused `FLASHLIGHT` permission.
  - Added Android network security config (`cleartextTrafficPermitted=false`) and manifest wiring.
  - Wired audio-visual beat sync for `minimal` sound mode via `onBeat` callback path.
  - Added overlap guard so new audio session hard-stops previous active context.
- Phase 4 (Tests/Polish):
  - Added tests for `getParamsAt` zero-duration and negative elapsed handling.
  - Added tests for NaN propagation and screen-strobe invalid-hz guard behavior.
  - Added test for torch failure fallback trigger.
  - Updated Home preset feasibility to use `torchFeasible(...)` (removes hardcoded `true`).
  - Added audio tests for minimal beat callback and overlap hard-stop behavior.
- Preview integration follow-up (same date):
  - Built Lumina web bundle with base path `/api/lumina/`.
  - Hosted generated bundle from backend at `/api/lumina` via `StaticFiles`.
  - Updated Expo index route to open Lumina preview URL directly on web (preview compatibility) and use WebView on native.
  - Verified preview now resolves to `https://strobe-engine-audit.preview.emergentagent.com/api/lumina/` and renders Lumina safety screen.
- Deployment readiness follow-up (same date):
  - Added missing `EXPO_PACKAGER_PROXY_URL` to `frontend/.env`.
  - Re-ran deploy readiness audit: now PASS with no blockers.
  - Re-validated health checks: `/`, `/api/`, `/api/lumina/` all return HTTP 200.
  - Android export check passed with `expo export --platform android --no-bytecode`.
  - Local APK assembly remains blocked in container due missing Java (`JAVA_HOME` not set).

## Validation Run
- ESLint: passed (`/app/_uploaded_src/lumina/**/*.{ts,tsx}`)
- Vitest: passed (27 tests)
- Production build: passed via direct toolchain invocation (`tsc -b`, `vite build`)

## Prioritized Backlog

### P0 Remaining
- None identified from requested phase list.

### P1 Remaining
- Optional UX refinement: explicit “session interrupted in background” confirmation before returning Home.

### P2 Remaining
- Add Android instrumentation test coverage for permission-request flow in `MainActivity`.
- Add end-to-end mobile automation pass for background/foreground behavior on real device/emulator.

## Next Tasks
1. Run Android emulator smoke test for lifecycle + torch permission flow.
2. Add UI test IDs consistently if automated UI testing is planned next.
3. Decide whether to remove minimal-mode fallback interval entirely now that beat sync is wired.