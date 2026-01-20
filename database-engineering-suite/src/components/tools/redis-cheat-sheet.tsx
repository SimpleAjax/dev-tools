'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RedisCommand {
    command: string;
    summary: string;
    complexity: string;
    complexityType: 'O(1)' | 'O(N)' | 'O(log N)';
    group: string;
    since: string;
}

const commands: RedisCommand[] = [
    // Keys
    { command: 'DEL', summary: 'Delete a key', complexity: 'O(N)', complexityType: 'O(N)', group: 'Generic', since: '1.0.0' },
    { command: 'EXISTS', summary: 'Check if key exists', complexity: 'O(1)', complexityType: 'O(1)', group: 'Generic', since: '1.0.0' },
    { command: 'EXPIRE', summary: 'Set a key\'s time to live in seconds', complexity: 'O(1)', complexityType: 'O(1)', group: 'Generic', since: '1.0.0' },
    { command: 'KEYS', summary: 'Find all keys matching the given pattern', complexity: 'O(N)', complexityType: 'O(N)', group: 'Generic', since: '1.0.0' },
    { command: 'TTL', summary: 'Get the time to live for a key', complexity: 'O(1)', complexityType: 'O(1)', group: 'Generic', since: '1.0.0' },
    { command: 'TYPE', summary: 'Determine the type stored at key', complexity: 'O(1)', complexityType: 'O(1)', group: 'Generic', since: '1.0.0' },

    // Strings
    { command: 'GET', summary: 'Get the value of a key', complexity: 'O(1)', complexityType: 'O(1)', group: 'String', since: '1.0.0' },
    { command: 'SET', summary: 'Set the string value of a key', complexity: 'O(1)', complexityType: 'O(1)', group: 'String', since: '1.0.0' },
    { command: 'INCR', summary: 'Increment the integer value of a key by one', complexity: 'O(1)', complexityType: 'O(1)', group: 'String', since: '1.0.0' },
    { command: 'DECR', summary: 'Decrement the integer value of a key by one', complexity: 'O(1)', complexityType: 'O(1)', group: 'String', since: '1.0.0' },
    { command: 'MGET', summary: 'Get the values of all the given keys', complexity: 'O(N)', complexityType: 'O(N)', group: 'String', since: '1.0.0' },
    { command: 'MSET', summary: 'Set multiple keys to multiple values', complexity: 'O(N)', complexityType: 'O(N)', group: 'String', since: '1.0.1' },

    // Hashes
    { command: 'HGET', summary: 'Get the value of a hash field', complexity: 'O(1)', complexityType: 'O(1)', group: 'Hash', since: '2.0.0' },
    { command: 'HGETALL', summary: 'Get all the fields and values in a hash', complexity: 'O(N)', complexityType: 'O(N)', group: 'Hash', since: '2.0.0' },
    { command: 'HSET', summary: 'Set the string value of a hash field', complexity: 'O(1)', complexityType: 'O(1)', group: 'Hash', since: '2.0.0' },
    { command: 'HDEL', summary: 'Delete one or more hash fields', complexity: 'O(N)', complexityType: 'O(N)', group: 'Hash', since: '2.0.0' },

    // Lists
    { command: 'LPUSH', summary: 'Prepend one or multiple values to a list', complexity: 'O(1)', complexityType: 'O(1)', group: 'List', since: '1.0.0' },
    { command: 'RPUSH', summary: 'Append one or multiple values to a list', complexity: 'O(1)', complexityType: 'O(1)', group: 'List', since: '1.0.0' },
    { command: 'LPOP', summary: 'Remove and get the first element in a list', complexity: 'O(1)', complexityType: 'O(1)', group: 'List', since: '1.0.0' },
    { command: 'RPOP', summary: 'Remove and get the last element in a list', complexity: 'O(1)', complexityType: 'O(1)', group: 'List', since: '1.0.0' },
    { command: 'LRANGE', summary: 'Get a range of elements from a list', complexity: 'O(S+N)', complexityType: 'O(N)', group: 'List', since: '1.0.0' },

    // Sets
    { command: 'SADD', summary: 'Add one or more members to a set', complexity: 'O(1)', complexityType: 'O(1)', group: 'Set', since: '1.0.0' },
    { command: 'SMEMBERS', summary: 'Get all the members in a set', complexity: 'O(N)', complexityType: 'O(N)', group: 'Set', since: '1.0.0' },
    { command: 'SISMEMBER', summary: 'Determine if a given value is a member of a set', complexity: 'O(1)', complexityType: 'O(1)', group: 'Set', since: '1.0.0' },
    { command: 'SREM', summary: 'Remove one or more members from a set', complexity: 'O(N)', complexityType: 'O(N)', group: 'Set', since: '1.0.0' },

    // Sorted Sets
    { command: 'ZADD', summary: 'Add one or more members to a sorted set, or update its score', complexity: 'O(log(N))', complexityType: 'O(log N)', group: 'Sorted Set', since: '1.2.0' },
    { command: 'ZRANGE', summary: 'Return a range of members in a sorted set, by index', complexity: 'O(log(N)+M)', complexityType: 'O(log N)', group: 'Sorted Set', since: '1.2.0' },
    { command: 'ZRANK', summary: 'Determine the index of a member in a sorted set', complexity: 'O(log(N))', complexityType: 'O(log N)', group: 'Sorted Set', since: '2.0.0' },
];

export function RedisCheatSheet() {
    const [search, setSearch] = useState('');

    const filteredCommands = commands.filter(cmd =>
        cmd.command.toLowerCase().includes(search.toLowerCase()) ||
        cmd.summary.toLowerCase().includes(search.toLowerCase()) ||
        cmd.group.toLowerCase().includes(search.toLowerCase())
    );

    const getComplexityColor = (type: string) => {
        if (type === 'O(1)') return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
        if (type === 'O(log N)') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    };

    const copyCommand = (cmd: string) => {
        navigator.clipboard.writeText(cmd);
    };

    return (
        <Card className="h-[calc(100vh-140px)] flex flex-col border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="border-b pb-4">
                <CardTitle className="text-lg">Redis Command Reference</CardTitle>
                <CardDescription>
                    Quickly check time complexity before running that command in production.
                </CardDescription>
                <div className="relative mt-2">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                        placeholder="Search commands (e.g., 'GET', 'Set', 'O(1)')..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden bg-slate-50 dark:bg-slate-950/50">
                <ScrollArea className="h-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                        {filteredCommands.map((cmd) => (
                            <div key={cmd.command} className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-mono text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                        {cmd.command}
                                    </h3>
                                    <Badge variant="secondary" className={`font-mono text-xs ${getComplexityColor(cmd.complexityType)}`}>
                                        {cmd.complexity}
                                    </Badge>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 h-10 line-clamp-2">
                                    {cmd.summary}
                                </p>
                                <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100 dark:border-slate-800">
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{cmd.group}</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyCommand(cmd.command)}
                                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Copy className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
