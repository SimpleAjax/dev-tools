import { useState } from 'react';
import Editor, { DiffEditor } from '@monaco-editor/react';
import { useDiffStore } from './store/diffStore';
import { canonicalize, safeParse } from './utils/jsonUtils';
import { Button } from './components/ui/Button';
import { Play, Split, FileJson, Check, Github } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const { originalContent, modifiedContent, setOriginalContent, setModifiedContent, settings, setSetting } = useDiffStore();
  const [viewMode, setViewMode] = useState<'edit' | 'diff'>('edit');

  const processJson = (text: string) => {
    const obj = safeParse(text);
    if (obj === undefined) return text;
    const canon = canonicalize(obj, { ignoreArrayOrder: settings.ignoreArrayOrder });
    return JSON.stringify(canon, null, 2);
  }

  const processedOriginal = viewMode === 'diff' ? processJson(originalContent) : '';
  const processedModified = viewMode === 'diff' ? processJson(modifiedContent) : '';

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden font-sans">
      {/* Header */}
      <header className="flex-none h-16 border-b border-border px-6 flex items-center justify-between bg-card z-10 shadow-sm relative">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2.5 rounded-lg shadow-lg shadow-primary/20">
            <Split className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              JSON Semantic Diff
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold flex items-center gap-2">
              Developer Tools <span className="w-1 h-1 rounded-full bg-green-500"></span> Local & Secure
            </p>
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 bg-muted p-1 rounded-xl border border-border/40 shadow-inner">
          <Button
            variant={viewMode === 'edit' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('edit')}
            className={cn("gap-2 rounded-lg px-4 transition-all", viewMode === 'edit' && "shadow-md")}
          >
            <FileJson className="w-4 h-4" />
            Edit Inputs
          </Button>
          <Button
            variant={viewMode === 'diff' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('diff')}
            className={cn("gap-2 rounded-lg px-4 transition-all", viewMode === 'diff' && "bg-gradient-to-r from-primary to-blue-600 text-white shadow-md shadow-blue-500/20 hover:from-primary/90 hover:to-blue-600/90")}
          >
            <Play className="w-4 h-4 fill-current" />
            Run Compare
          </Button>
        </div>

        <div className="flex items-center gap-4">
          {/* Settings Toggles */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground mr-2">
            <button
              onClick={() => setSetting('ignoreArrayOrder', !settings.ignoreArrayOrder)}
              className={cn("group flex items-center gap-2.5 transition-all outline-none",
                settings.ignoreArrayOrder ? "text-primary" : "hover:text-foreground")}
            >
              <div className={cn("w-5 h-5 border rounded-md flex items-center justify-center transition-all duration-200",
                settings.ignoreArrayOrder ? "bg-primary border-primary text-primary-foreground shadow-sm" : "border-input group-hover:border-foreground/50 bg-background")}>
                <Check className={cn("w-3.5 h-3.5 transition-transform duration-200", settings.ignoreArrayOrder ? "scale-100" : "scale-0")} />
              </div>
              <span>Ignore Array Order</span>
            </button>
          </div>

          <Button variant="outline" size="icon" className="rounded-full w-9 h-9">
            <Github className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full relative bg-muted/10">
        {viewMode === 'edit' ? (
          <div className="absolute inset-0 grid grid-cols-2 divide-x divide-border">
            {/* Left Pane */}
            <div className="flex flex-col h-full bg-background/50">
              <div className="flex-none h-10 border-b border-border px-4 flex items-center justify-between text-xs font-medium text-muted-foreground bg-muted/20">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500/50" />
                  <span className="text-foreground/80 font-mono">Original JSON</span>
                </div>
                <span className="text-[10px] opacity-50">Paste or type here</span>
              </div>
              <div className="flex-1 relative group">
                <Editor
                  height="100%"
                  defaultLanguage="json"
                  theme="vs-dark"
                  value={originalContent}
                  onChange={(val) => setOriginalContent(val)}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    padding: { top: 16 },
                    scrollBeyondLastLine: false,
                    fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
                    smoothScrolling: true,
                    cursorBlinking: 'smooth',
                  }}
                />
              </div>
            </div>

            {/* Right Pane */}
            <div className="flex flex-col h-full bg-background/50">
              <div className="flex-none h-10 border-b border-border px-4 flex items-center justify-between text-xs font-medium text-muted-foreground bg-muted/20">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500/50" />
                  <span className="text-foreground/80 font-mono">Modified JSON</span>
                </div>
                <span className="text-[10px] opacity-50">Paste or type here</span>
              </div>
              <div className="flex-1 relative">
                <Editor
                  height="100%"
                  defaultLanguage="json"
                  theme="vs-dark"
                  value={modifiedContent}
                  onChange={(val) => setModifiedContent(val)}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    padding: { top: 16 },
                    scrollBeyondLastLine: false,
                    fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
                    smoothScrolling: true,
                    cursorBlinking: 'smooth',
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col bg-background">
            <div className="flex-none h-10 border-b border-border px-6 flex items-center gap-4 text-xs font-medium text-muted-foreground bg-muted/20 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-primary">
                <Play className="w-3 h-3 fill-current" />
                <span>Semantic Comparison Result</span>
              </div>
              <div className="h-4 w-px bg-border my-auto" />
              <div className="flex items-center gap-2">
                <span>Status:</span>
                {processedOriginal === processedModified ? (
                  <span className="text-green-500 font-bold flex items-center gap-1"><Check className="w-3 h-3" /> No semantic changes found</span>
                ) : (
                  <span className="text-orange-500 font-bold flex items-center gap-1">Diff detected</span>
                )}
              </div>
            </div>
            <div className="flex-1">
              <DiffEditor
                height="100%"
                language="json"
                theme="vs-dark"
                original={processedOriginal}
                modified={processedModified}
                options={{
                  renderSideBySide: true,
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 13,
                  // padding: { top: 16 },
                  diffWordWrap: 'off',
                  fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
                  smoothScrolling: true,
                }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
