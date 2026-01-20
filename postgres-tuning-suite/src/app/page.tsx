import { ConnectionPoolSizer } from "@/components/tools/connection-pool-sizer";
import { MemoryAllocator } from "@/components/tools/memory-allocator";
import { PgHbaGenerator } from "@/components/tools/pg-hba-generator";
import { WalEstimator } from "@/components/tools/wal-estimator";
import { AutovacuumTuner } from "@/components/tools/autovacuum-tuner";
import { IdExhaustionClock } from "@/components/tools/id-exhaustion-clock";
import { CheckpointVisualizer } from "@/components/tools/checkpoint-visualizer";
import { CacheRatioSimulator } from "@/components/tools/cache-ratio-simulator";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24">
      <div className="border-b bg-white dark:bg-slate-950 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              P
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Postgres<span className="text-blue-600">Tuners</span>
            </h1>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
            <a href="#pool-sizer" className="hover:text-blue-600">Pool Sizer</a>
            <a href="#memory-allocator" className="hover:text-blue-600">RAM Calculator</a>
            <a href="#hba-generator" className="hover:text-blue-600">HBA Generator</a>
            <a href="#wal-estimator" className="hover:text-blue-600">WAL Estimator</a>
            <a href="#autovacuum" className="hover:text-blue-600">Vacuum Tuner</a>
            <a href="#id-clock" className="hover:text-blue-600">Doomsday Clock</a>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-20">

        {/* Connection Pool Sizer Section */}
        <section id="pool-sizer" className="scroll-mt-24">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              1. Connection Pool Sizer
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              Stop guessing your <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded text-sm">max_connections</code>.
              Most Postgres instances are configured with too many connections, causing <span className="font-semibold text-red-500">context switching overhead</span>.
              Use this simulation to find the sweet spot for your hardware.
            </p>
          </div>
          <ConnectionPoolSizer />
        </section>

        {/* Separator */}
        <div className="w-full h-px bg-slate-200 dark:bg-slate-800" />

        {/* Memory Allocator Section */}
        <section id="memory-allocator" className="scroll-mt-24">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              2. Visual Memory Allocator
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              OOM Kills are the #1 cause of sudden Postgres crashes.
              Visualize how <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded text-sm">work_mem</code> scales with connections to see if your server is safe.
            </p>
          </div>
          <MemoryAllocator />
        </section>

        {/* Separator */}
        <div className="w-full h-px bg-slate-200 dark:bg-slate-800" />

        {/* HBA Generator Section */}
        <section id="hba-generator" className="scroll-mt-24">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              3. pg_hba.conf Generator
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              Setting up remote access often leads to "FATAL: no pg_hba.conf entry".
              Generate a safe configuration snippet in seconds.
            </p>
          </div>
          <PgHbaGenerator />
        </section>

        {/* Separator */}
        <div className="w-full h-px bg-slate-200 dark:bg-slate-800" />

        {/* WAL Estimator Section */}
        <section id="wal-estimator" className="scroll-mt-24">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              4. WAL Bandwidth Estimator
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              Planning a Read Replica or DR site? Ensure your network pipe is big enough to handle the replication stream.
            </p>
          </div>
          <WalEstimator />
        </section>

        {/* Separator */}
        <div className="w-full h-px bg-slate-200 dark:bg-slate-800" />

        {/* Autovacuum Tuner Section */}
        <section id="autovacuum" className="scroll-mt-24">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              5. Autovacuum Frequency Tuner
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              Understand the "Bloat Sawtooth". Visualize when autovacuum kicks in and how much wasted space accumulates.
            </p>
          </div>
          <AutovacuumTuner />
        </section>

        {/* Separator */}
        <div className="w-full h-px bg-slate-200 dark:bg-slate-800" />

        {/* ID Exhaustion Clock */}
        <section id="id-clock" className="scroll-mt-24">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              6. Integer Overflow Doomsday Clock
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              Using standard `SERIAL`? Find out exactly when your primary keys will run out and crash your app.
            </p>
          </div>
          <IdExhaustionClock />
        </section>

        {/* Separator */}
        <div className="w-full h-px bg-slate-200 dark:bg-slate-800" />

        {/* Checkpoint Visualizer */}
        <section id="checkpoint-visualizer" className="scroll-mt-24">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              7. Checkpoint Spike Visualizer
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              Understand why your database "freezes" every 5 minutes and how `completion_target` smoothes I/O spikes.
            </p>
          </div>
          <CheckpointVisualizer />
        </section>

        {/* Separator */}
        <div className="w-full h-px bg-slate-200 dark:bg-slate-800" />

        {/* Cache Ratio Simulator */}
        <section id="cache-simulator" className="scroll-mt-24">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              8. Cache Hit Ratio Simulator
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              Visualize the cliff-edge performance drop when your Hot Data exceeds RAM.
            </p>
          </div>
          <CacheRatioSimulator />
        </section>

      </div>

      <footer className="mt-20 border-t py-12 text-center text-slate-500 text-sm">
        <p>Built for engineers who prefer visual explanations over manual math.</p>
        <p className="mt-2">© 2026 PostgresTuners. Experimental Tools.</p>
      </footer>
    </main>
  );
}
