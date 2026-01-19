# Product Requirements Document: Postgres Isolation Studio

## 1. Executive Summary
**Postgres Isolation Studio** is a client-side, browser-based interactive simulator that allows developers to run two concurrent SQL sessions side-by-side on a shared database instance. Built on `pg-lite` (WASM Postgres), it provides a tangible, risk-free environment to experiment with transaction isolation levels, locking mechanisms, and race conditions.

The primary goal is **marketing**. By solving a genuine frustration (setting up local environments to test locking) and gamifying the "aha!" moments of database concurrency, we aim to create a viral resource that drives traffic to the wider Reseolio ecosystem.

## 2. Value Proposition
*   **For Developers:** "Finally understand `REPEATABLE READ` vs `READ COMMITTED` by seeing it happen." No Docker containers, no local Postgres installs, just instant browser-based experimentation.
*   **For Cimulink/Reseolio:** High-quality traffic source. Establishes technical authority in the backend/infrastructure space.
*   **The "Viral Hook":** Shareable scenarios (e.g., "Can you fix this deadlock?"). A "Lock Yourself Out" challenge.

## 3. Target Audience
*   **Backend Engineers:** Debugging concurrency issues or learning advanced Postgres features.
*   **Junior/Mid-level Developers:** Studying for interviews or trying to grasp ACID compliance practically.
*   **DBAs:** Demonstrating behaviors to teams.

## 4. User Experience (UX)
### 4.1 Core Interface
The UI mimics a sleek, modern developer environment (VS Code / Terminal aesthetic).
*   **Split Screen Layout:**
    *   **Left Pane:** Terminal A (Session 1)
    *   **Right Pane:** Terminal B (Session 2)
    *   **Right/Bottom Panel:** Visualizer & Controls (Table view, Lock graph, Scenario selector).
*   **Visual Feedback:**
    *   When a query hangs (waiting for lock), the terminal cursor pulses/changes color (e.g., Amber).
    *   "Blocked" indicators allow the user to see *why* they are waiting without checking `pg_locks` manually (though they can DO that too).

### 4.2 User Journey (The "Happy Path")
1.  User lands on the page. Instant boot of `pg-lite`.
2.  Selects a scenario: "The Double Booking Problem (READ COMMITTED)".
3.  Terminal A performs a `SELECT`. Terminal B updates the row.
4.  Terminal A selects again. Data has changed! (Phantom Read/Non-repeatable read demo).
5.  User toggles scenario to "REPEATABLE READ".
6.  Repeats steps. Terminal A sees the snapshot data.
7.  User creates a serialization anomaly.
8.  Call to Action: "Need to handle distributed locking cleanly? Check out Reseolio."

## 5. Functional Requirements

### 5.1 Database Engine
*   **Tech:** `@electric-sql/pg-lite`
*   **Behavior:** A single in-memory or IndexedDB-persisted Postgres instance shared between two "clients".
*   **Clients:** The two terminals simulate separate connections to the SAME `pg-lite` instance. *Implementation Note: pg-lite runs in the main thread or a worker. We need to ensure the "blocking" behavior is simulated or handled correctly since JS is single-threaded. pg-lite might return promises that don't resolve if locked. We need to verify if `pg-lite` fully supports row-level locking behavior in a way that allows us to show 'waiting' state in the UI.*

### 5.2 Terminal Simulator
*   **Input:** SQL syntax highlighting. History support (up/down arrows).
*   **Output:** Table formatting for result sets. Error messages in red.
*   **Status:** Connection PID display. Transaction status indicator (Idle, In-Transaction, Error).

### 5.3 Scenarios Module
Pre-loaded scripts that auto-type or guide the user through specific lessons:
1.  **Dirty Reads (if applicable/supported)**
2.  **Non-repeatable Reads (Default RC)**
3.  **Phantom Reads**
4.  **Lost Updates**
5.  **Deadlocks:** Trigger a deadlock and see Postgres kill one transaction.
6.  **`FOR UPDATE` / `SKIP LOCKED`:** The "Queue" pattern demo (highly relevant to Reseolio).

### 5.4 Visualization Layer (The "Magic")
*   **Table Watcher:** A live view of a specific table (e.g., `accounts` or `seats`) that updates in real-time as commits happen.
*   **Lock Monitor:** A simplified visual representation of who holds what lock.
    *   "Session A holds RowLock on ID:1"
    *   "Session B is waiting for RowLock on ID:1"

## 6. Technical Architecture & Constraints

### 6.1 Frontend Stack
*   **Framework:** React (Next.js or Vite - likely Vite for lighter weight clientside focus).
*   **State Management:** Zustand or React Context for terminal state.
*   **Styling:** Tailwind CSS (Dark Mode default).
*   **Components:**
    *   `react-console-emulator` or `xterm.js` for the terminal feel.
    *   Custom table components for data visualization.

### 6.2 Key Technical Challenge: Locking in the Browser (SOLVED)
Since `pg-lite` runs in the browser, does `SELECT ... FOR UPDATE` actually pause execution of a second query from a different "client"?

*   **Investigation Findings (Verified):**
    *   **Single PGlite Instance:** Logic behaves as a single backend session (PID 0). Concurrent "clients" share the same transaction scope, making isolation testing impossible.
    *   **Multiple PGlite Instances:** Independent instances sharing an IndexedDB act like "split-brain" servers. They isolate data visibility (MVCC works) but **do not share locks**. Client B can overwrite a row locked by Client A immediately.

*   **Verified Solution: The "Virtual Lock Manager"**
    *   **Architecture:** Use **two separate PGlite instances** connected to the same `idb://` storage.
    *   **Coordination:** Implement a distinct `LockManager` class (outside Postgres) that intercepts queries.
        *   When Client A runs `FOR UPDATE`, the manager records a virtual lock.
        *   When Client B attempts a conflicting write, the manager **intercepts the request** and returns a pending Promise, putting the client in a "WAITING" state.
    *   **Result:** This successfully mimics Postgres row-locking behavior for the user, while using real `pg-lite` instances for data persistence and SQL execution.
    *   **Reference Code:** See `poc/simulated_locking.html` for the working implementation snippet.

## 7. Development Roadmap

### Phase 1: PoC (Proof of Concept)
*   Setup React + pg-lite.
*   Implement two text inputs that send SQL to the DB.
*   Verify that `BEGIN;` in Input A starts a txn that Input B respects (e.g., `LOCK TABLE`).
*   Verify UI can detect "Request sent, waiting for response..." vs. "Response received."

### Phase 2: The Studio UI
*   Build the Split Pane layout.
*   Implement syntax highlighting SQL editor.
*   Add the "Live Table View" sidebar.

### Phase 3: Content & Scenarios
*   Write the SQL scripts for the 5 core scenarios.
*   Add "Next Step" guide prompts (e.g., "Now type COMMIT in Terminal A").

### Phase 4: Polish & Launch
*   Mobile responsiveness (stack terminals).
*   SEO meta tags.
*   "Share this Scenario" URL parameter generation.

## 8. Success Metrics
*   **Time on Page:** > 3 minutes implies users are actually running scenarios.
*   **Scenario Completions:** Users reaching the end of a guided lesson.
*   **Social Shares:** Mentioning "Postgres Isolation Studio".
