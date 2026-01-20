# Postgres Tuning & Utility Suite - Engineering as Marketing Plan

## 1. Executive Summary
**Goal**: Create a collection of high-utility, client-side tools that solve "back-of-the-napkin" math problems for Postgres administrators and developers.
**Marketing Angle**: "Stop guessing your config." Visualizers that explain *why* a setting is recommended, not just *what* it should be.
**Tech Stack**: React/Next.js + Tailwind (shadcn/ui) + Client-side logic (no backend required).

## 2. Target Audience Profiles
*   **Profile A: The "Accidental DBA"**
    *   **Role**: Senior Backend Developer or Full Stack Engineer.
    *   **Context**: Their app is growing, the database is slowing down, and they are reading docs about `work_mem` for the first time.
    *   **Pain Point**: Overwhelmed by 300+ config options. Afraid of OOM (Out of Memory) crashes.
*   **Profile B: The Infrastructure Automator**
    *   **Role**: DevOps / SRE.
    *   **Context**: Writing Terraform/Ansible scripts to deploy RDS or bare-metal Postgres.
    *   **Pain Point**: Needs sane defaults for specific hardware sizes without spinning up an instance to check.

## 3. Tool Suite Concepts

### Tool 1: Visual Memory Allocator ("The RAM Map")
**One-line Pitch**: "Visualize exactly where your server RAM goes before you crash it."
*   **Scenario**: A developer creates a PR to increase `work_mem` to 256MB on a standard web server. They don't realize that 100 active connections will cause an immediate OOM kill.
*   **Input**: Total System RAM, `max_connections`, OS Overhead estimate.
*   **Output**:
    *   **Interactive Treemap**: Visualizing `shared_buffers` (Global) vs `work_mem` * `active_connections` (Per Session) vs OS Cache.
    *   **Safety Score**: "Critical Risk" if potential peak usage > Physical RAM.
*   **Wow factor**: As they drag the `max_connections` slider, the "Per Session" block expands, turning red as it eats into OS RAM.

### Tool 2: Connection Pool Sizer & Latency Simulator
**One-line Pitch**: "Prove to your boss why 5000 connections is a bad idea."
*   **Scenario**: An application is experiencing high latency. The team wants to increase pool size. This tool demonstrates that *decreasing* it usually helps.
*   **Input**: CPU Cores, HDD vs SSD, Active Transactions count.
*   **Output**:
    *   **Optimal Pool Size**: Based on the formula `(core_count * 2) + effective_spindle_count`.
    *   **Interactive Simulation**: An animated visualization of CPU cores (workers) processing tasks.
        *   *Mode A (Bad)*: 100 connections fighting for 4 cores (context switching hell).
        *   *Mode B (Good)*: 10 connections optimally using 4 cores (smooth throughput).
*   **Wow factor**: An animated particle system showing requests getting "stuck" when the pool is too large.

### Tool 3: WAL Bandwidth Estimator
**One-line Pitch**: "Will your network survive the replication traffic?"
*   **Scenario**: Planning a Disaster Recovery site or a Read Replica in a different region. User needs to know if their 100Mbps VPC peering link is enough.
*   **Input**: Write Transactions Per Second (TPS), Average Row Size, Index Count (multiplier for WAL noise).
*   **Output**:
    *   **Estimated Bandwidth**: MB/s required for replication.
    *   **Lag Calculator**: If link is 50Mbps but generation is 100Mbps, how fast does lag accumulate?
*   **Wow factor**: A pipe visualization. If generation > bandwidth, the pipe bursts or a "Lag Buffer" tank fills up rapidly.

### Tool 4: `pg_hba.conf` Visual Generator
**One-line Pitch**: "Generate the most confusing config file without syntax errors."
*   **Scenario**: Setting up a new server and getting `FATAL: no pg_hba.conf entry for host...`.
*   **Input**: Form-based UI (Allow User X from IP Y using Method Z).
*   **Output**:
    *   A correctly formatted `pg_hba.conf` snippet.
    *   Security Warnings (e.g., highlighting `trust` auth in red warnings).
*   **Wow factor**: Real-time validation regex that explains what each line does in plain English as you hover over it.

### Tool 5: The "Bloat Timeline" (Autovacuum Tuner)
**One-line Pitch**: "Seetable bloat happening in real-time."
*   **Scenario**: A high-update table (e.g., a counter or queue) is growing indefinitely despite deleting rows.
*   **Input**: Table Size, Updates Per Second, Default Autovacuum settings (`scale_factor`, `threshold`).
*   **Output**:
    *   **Timeline Graph**: Shows "Dead Tuples" accumulating over time.
    *   **Trigger Point**: Marks exactly when Autovacuum *should* kick in.
    *   **Recommendation**: "For this update rate, lower `scale_factor` to X to prevent massive I/O spikes."

## 4. Implementation Priority (MVP)

1.  **Connection Pool Sizer**: (Implemented) Easiest to implement, highest educational value regarding "Wait/Queue" theory.
2.  **Visual Memory Allocator**: (Implemented) High visual impact, solves a very common crash cause.
3.  **pg_hba Generator**: (Implemented) Utility/Clipboard tool, sticky for returning users.
4.  **WAL Bandwidth Estimator**: (Implemented) Crucial for replication planning.
5.  **Autovacuum Tuner**: (Implemented) Visualizing the "Sawtooth" bloat pattern.

## 5. Design & Aesthetics Strategy
*   **Theme**: "Dark Database Console" – Deep blues/purples (Postgres brand compatible) but modern (glassmorphism).
*   **Interactive**: Use sliders for inputs, not text boxes. Users should "feel" the config changing.
*   **Educational**: Every result must carry a "Why?" tooltip.

### Tool 6: Integer Overflow Doomsday Clock (ID Exhaustion)
**One-line Pitch**: "When will your primary keys run out?"
*   **Scenario**: A startup used `SERIAL` (int4) instead of `BIGSERIAL` (int8). They are growing 10x YoY. When does the app crash?
*   **Input**: Current Max ID, Inserts Per Second (Avg), Growth Rate (%).
*   **Output**: 
    *   **Doomsday Date**: The exact date/time `2,147,483,647` is reached.
    *   **Countdown Timer**: "You have 4 years, 3 months remaining."
*   **Wow factor**: A dramatic "Doomsday Clock" countdown.

### Tool 7: Checkpoint Spike Visualizer
**One-line Pitch**: "Why does my database freeze every 5 minutes?"
*   **Scenario**: Users complain of periodic latency spikes. The admin sees I/O spikes but doesn't correlate them with `checkpoint_timeout`.
*   **Input**: `max_wal_size`, `checkpoint_timeout`, Write MB/s.
*   **Output**:
    *   **Animation**: A buffer filling up. When it hits the limit OR the timeout, a massive "Flush" event happens.
    *   **Spread Checkpoint**: Shows how `checkpoint_completion_target` (default 0.5 vs recommended 0.9) spreads the I/O load.
*   **Wow factor**: Visualizing the difference between a "Brick Wall" flush (bad) and a "Smooth" flush (good).

### Tool 8: Cache Hit Ratio Simulator (Effective Cache Size)
**One-line Pitch**: "How much RAM is actually saving you disk reads?"
*   **Scenario**: Trying to explain why `effective_cache_size` matters to the query planner.
*   **Input**: Database Size, Active Working Set %, Total RAM.
*   **Output**:
    *   **Pie Chart**: Disk Reads vs RAM Hits.
    *   **Performance Impact**: "If you drop RAM by 2GB, your disk IOPS will 10x."
