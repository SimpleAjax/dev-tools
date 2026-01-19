import { useEffect, useRef } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import { TableWatcher } from "@/components/TableWatcher";
import { SqlTerminal } from "@/components/SqlTerminal";
import { useTerminalSession } from "@/hooks/use-terminal-session";

function App() {
  // We need to define the handlers BEFORE useTerminalSession if we want to pass them, 
  // but useTerminalSession returns the objects we need to refresh.
  // We can use a ref or simple effect?
  // Actually, standard functional patterns: 
  // Let's create the refresh triggers separately or wrap them.

  // Actually easiest way is to use a shared specialized hook or just pass a callback that uses a REF to validity check
  // But since we are inside the component, we can't refer to terminalB before it's const-declared.
  // We will pass the callbacks via a mutable Ref or context, OR simplified:
  // useTerminalSession returns 'refresh'.
  // We can wrap the `execute` calls? No, `useTerminalSession` does the execution.

  // Ref-based approach to break circular dependency
  const terminalARef = useRef<any>(null);
  const terminalBRef = useRef<any>(null);

  const syncB = () => {
    // If A commits, we want to refresh B IF B is idle.
    if (terminalBRef.current && terminalBRef.current.status === 'idle') {
      // Check if B has an active transaction? 
      // Our `status` is currently 'idle' | 'waiting' | 'acquired'. 
      // 'acquired' means actively waiting on lock or held lock? 
      // Actually `status` in SqlTerminal is mostly about UI busy/lock state.
      // It doesn't track "In Transaction".
      // But for now, if it's 'idle', it's safe-ish to refresh (snapshot reset).
      // Ideally we only refresh if NOT in transaction. 
      // PGlite doesn't easily tell us "in transaction" without tracking.
      // For now, let's just Try Refreshing. It resets the session. 
      // If the user was in the middle of a Tx, they lose it. 
      // This creates a "Sync" outcome -> B sees A's data.
      // If user was typing `INSERT...`, they lose the session state.
      // Maybe only sync if we haven't typed "BEGIN"?
      // Use 'refresh' method.
      terminalBRef.current.refresh();
    }
  };

  const syncA = () => {
    if (terminalARef.current && terminalARef.current.status === 'idle') {
      terminalARef.current.refresh();
    }
  };

  const terminalA = useTerminalSession("Terminal A", "idb://studio-db-v1", syncB);
  const terminalB = useTerminalSession("Terminal B", "idb://studio-db-v1", syncA);

  // Keep refs up to date
  terminalARef.current = terminalA;
  terminalBRef.current = terminalB;


  // Init on mount
  const initialized = useRef(false);
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initSessions = async () => {
      await terminalA.init();
      // Delay slightly to ensure IDB locks are settled if needed, though await should suffice if PGlite yields.
      await terminalB.init();
    };
    initSessions();
    // eslint-disable-next-line
  }, []);



  return (
    <div className="h-screen w-full bg-background text-foreground flex flex-col overflow-hidden">
      {/* Navbar/Header */}
      <header className="h-14 border-b flex items-center px-6 justify-between bg-card">
        <div className="font-bold text-lg tracking-tight">Postgres Isolation Studio</div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup orientation="horizontal">

          {/* Terminal A */}
          <ResizablePanel defaultSize={35} minSize={20}>
            <div className="h-full flex flex-col p-2 bg-slate-50 dark:bg-zinc-950/50">
              <SqlTerminal
                name="Session A"
                lines={terminalA.lines}
                status={terminalA.status}
                onExecute={terminalA.execute}
                color="blue"
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Terminal B */}
          <ResizablePanel defaultSize={35} minSize={20}>
            <div className="h-full flex flex-col p-2 bg-slate-50 dark:bg-zinc-950/50">
              <SqlTerminal
                name="Session B"
                lines={terminalB.lines}
                status={terminalB.status}
                onExecute={terminalB.execute}
                color="purple"
              />
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Sidebar / Viz */}
          <ResizablePanel defaultSize={30} minSize={20} collapsible={true}>
            <div className="h-full border-l bg-card p-4">
              <TableWatcher session={terminalA.session} onExecute={terminalA.execute} />
            </div>
          </ResizablePanel>

        </ResizablePanelGroup>
      </div>
    </div>
  );
}

export default App;
