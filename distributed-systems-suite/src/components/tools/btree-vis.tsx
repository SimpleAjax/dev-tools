"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RefreshCw, Plus, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// -- B-Tree Logic (Simplified In-Memory) --
// A standard B-Tree node
interface BTreeNode {
    id: string;
    keys: number[];
    children: BTreeNode[];
    isLeaf: boolean;
}

const ORDER = 3; // Max keys = 3, Max children = 4. Split at 4 keys.

/*
  Simplified B-Tree insertion is complex to implement fully from scratch in one file.
  We will implement a visualization that *mimics* splitting behavior for a specific small scale.
  OR implement a real B-Tree class. A real class is better for correctness.
*/

class BTree {
    root: BTreeNode;

    constructor() {
        this.root = { id: Math.random().toString(), keys: [], children: [], isLeaf: true };
    }

    insert(key: number) {
        const root = this.root;
        if (root.keys.length === (ORDER)) { // limit
            // Split root
            const newRoot: BTreeNode = { id: Math.random().toString(), keys: [], children: [], isLeaf: false };
            newRoot.children.push(this.root);
            this.splitChild(newRoot, 0);
            this.root = newRoot;
            this.insertNonFull(this.root, key);
        } else {
            this.insertNonFull(root, key);
        }
    }

    insertNonFull(node: BTreeNode, key: number) {
        let i = node.keys.length - 1;
        if (node.isLeaf) {
            while (i >= 0 && key < node.keys[i]) i--;
            node.keys.splice(i + 1, 0, key);
        } else {
            while (i >= 0 && key < node.keys[i]) i--;
            i++;
            if (node.children[i].keys.length === ORDER) {
                this.splitChild(node, i);
                if (key > node.keys[i]) i++;
            }
            this.insertNonFull(node.children[i], key);
        }
    }

    splitChild(parent: BTreeNode, index: number) {
        const t = Math.ceil(ORDER / 2); // Split point
        const child = parent.children[index];
        const newChild: BTreeNode = {
            id: Math.random().toString(),
            keys: [],
            children: [],
            isLeaf: child.isLeaf
        };

        // If ORDER=3 (Max keys 2? Wait usually Order M means max children M, max keys M-1)
        // Let's assume Max Keys is `ORDER`. Split when size == ORDER.
        // mid index = floor(ORDER/2).

        // For visual simplicity, let's treat ORDER as "Max Keys before split".
        // e.g. Max 3 keys. When 4th added -> Split.
        // Mid goes up.

        const midIndex = Math.floor(child.keys.length / 2);
        const midKey = child.keys[midIndex];

        // Right side keys
        newChild.keys = child.keys.splice(midIndex + 1);
        // Left side keys keeps 0..mid-1. 
        // We remove midKey later.
        child.keys.splice(midIndex, 1); // Remove midKey from child

        if (!child.isLeaf) {
            newChild.children = child.children.splice(midIndex + 1);
        }

        parent.children.splice(index + 1, 0, newChild);
        parent.keys.splice(index, 0, midKey);
    }
}

// Global instance for persistence across renders (React state replacement)
let treeInstance = new BTree();

export default function BTreeVis() {
    const [tree, setTree] = useState<BTreeNode>(treeInstance.root);
    const [inputVal, setInputVal] = useState("");
    const [highlight, setHighlight] = useState<number | null>(null);

    const insert = () => {
        const val = parseInt(inputVal);
        if (isNaN(val)) return;
        treeInstance.insert(val);
        setTree({ ...treeInstance.root }); // Force update
        setInputVal("");
    };

    const reset = () => {
        treeInstance = new BTree();
        setTree({ ...treeInstance.root });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') insert();
    };

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] gap-6">
            <Card className="shrink-0">
                <CardContent className="pt-6 flex gap-4 items-center">
                    <div className="flex gap-2">
                        <Input
                            type="number"
                            placeholder="Value"
                            value={inputVal}
                            onChange={e => setInputVal(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-32"
                        />
                        <Button onClick={insert}>
                            <Plus className="mr-2 w-4 h-4" /> Insert
                        </Button>
                    </div>
                    <Button variant="outline" onClick={reset}>
                        <RefreshCw className="mr-2 w-4 h-4" /> Reset Default
                    </Button>
                    <div className="text-sm text-muted-foreground ml-auto">
                        Order (Leaf Capacity): <strong>{ORDER}</strong>. Nodes split when full.
                    </div>
                </CardContent>
            </Card>

            <Card className="flex-1 bg-slate-50 dark:bg-slate-900/50 overflow-hidden relative">
                <CardContent className="h-full w-full overflow-auto p-10 flex items-start justify-center">
                    <RecursiveNode node={tree} depth={0} />
                </CardContent>
            </Card>
        </div>
    );
}

function RecursiveNode({ node, depth }: { node: BTreeNode, depth: number }) {
    return (
        <div className="flex flex-col items-center">
            {/* The Node Itself */}
            <motion.div
                layout
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex border-2 border-slate-400 bg-card rounded shadow-sm overflow-hidden mb-8 z-10"
            >
                {node.keys.map((k, i) => (
                    <div key={i} className="px-3 py-2 border-r last:border-0 hover:bg-secondary cursor-default min-w-[30px] text-center font-bold">
                        {k}
                    </div>
                ))}
            </motion.div>

            {/* Children container */}
            {node.children.length > 0 && (
                <div className="flex gap-4 border-t-2 border-dashed border-slate-300 pt-8 relative">
                    {/* Visual branch lines are hard in pure flexbox, using border-t on container is a simple approx */}
                    {node.children.map((child) => (
                        <RecursiveNode key={child.id} node={child} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}

// Fix for simple split logic:
// My BTree class above is a bit hacking.
// Real BTree splitting promotes mid to parent.
// If parent is full, parent splits. Recursive up.
// The visualizer should show this structure.
