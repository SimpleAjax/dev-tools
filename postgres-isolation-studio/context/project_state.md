# Postgres Isolation Studio: Project Context

## Status
**Phase:** 2 (UI Construction)
**Date:** 2026-01-19

## Key Architectural Decisions
1.  **Engine:** `pg-lite` (WASM Postgres).
2.  **Concurrency Model:** **Multiple Instance + Virtual Coordinator**.
    *   **Verified:** We use `LockManager` to intercept `FOR UPDATE` and `UPDATE` queries.
    *   **Validated:** The "Verify App" proved that Client B correctly blocks while Client A holds a virtual lock.

## Plan
### Immediate Next Steps
1.  **Layout:** Implement the Split Pane UI (Terminal A / Terminal B).
2.  **Components:**
    *   Integrate a Terminal Component (e.g., `react-console-emulator` or simple custom one).
    *   Build the "Live Table View" sidebar.
3.  **Integration:** Connect the UI terminals to `SimulatedSession`.

### Todo List
- [x] Verify `pg-lite` locking behavior (POC).
- [x] Initialize `studio` directory (Vite).
- [x] Create `LockManager` service.
- [ ] Implement Split Screen Layout.
- [ ] Connect Terminal UI to `SimulatedSession`.
