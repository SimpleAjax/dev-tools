import { create } from 'zustand';

interface DiffSettings {
    ignoreArrayOrder: boolean;
    ignoreWhitespace: boolean;
}

interface DiffState {
    originalContent: string;
    modifiedContent: string;
    settings: DiffSettings;
    setOriginalContent: (content: string | undefined) => void;
    setModifiedContent: (content: string | undefined) => void;
    setSetting: (key: keyof DiffSettings, value: boolean) => void;
}

const defaultOriginal = JSON.stringify({
    "project": "Semantic Diff",
    "version": 1,
    "features": ["diff", "sort", "ignore-order"],
    "meta": {
        "created": 2024,
        "author": "Antigravity"
    }
}, null, 2);

const defaultModified = JSON.stringify({
    "version": 1,
    "project": "Semantic Diff",
    "features": ["ignore-order", "diff", "sort"],
    "meta": {
        "author": "Antigravity",
        "created": 2024
    }
}, null, 2);

export const useDiffStore = create<DiffState>((set) => ({
    originalContent: defaultOriginal,
    modifiedContent: defaultModified,
    settings: {
        ignoreArrayOrder: false, // Default off as per PRD test cases (Standard vs Ignored)
        ignoreWhitespace: true,
    },
    setOriginalContent: (c) => set({ originalContent: c || '' }),
    setModifiedContent: (c) => set({ modifiedContent: c || '' }),
    setSetting: (k, v) => set((state) => ({ settings: { ...state.settings, [k]: v } })),
}));
