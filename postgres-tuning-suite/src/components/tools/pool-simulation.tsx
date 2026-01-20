"use client"

import React, { useEffect, useRef } from 'react'

interface PoolSimulationProps {
    coreCount: number
    mode: 'optimized' | 'overloaded'
    isPlaying: boolean
}

interface Particle {
    id: number
    x: number
    y: number
    speed: number
    state: 'queued' | 'processing' | 'done' | 'switching'
    lane?: number
    color: string
}

export function PoolSimulation({ coreCount, mode, isPlaying }: PoolSimulationProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const particlesRef = useRef<Particle[]>([])
    const animationRef = useRef<number>(0)

    // Reset simulation when mode changes
    useEffect(() => {
        particlesRef.current = []
        // Initialize 50 particles
        for (let i = 0; i < 50; i++) {
            particlesRef.current.push({
                id: i,
                x: Math.random() * -100 - 20, // Start off-screen
                y: 0,
                speed: 0,
                state: 'queued',
                color: mode === 'optimized' ? '#10b981' : '#ef4444' // Emerald-500 vs Red-500
            })
        }
    }, [mode, coreCount])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const render = () => {
            // Clear
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            const cpuWidth = 100
            const cpuX = canvas.width - cpuWidth - 20
            const laneHeight = canvas.height / coreCount

            // Draw CPU Cores (Lanes)
            ctx.fillStyle = mode === 'optimized' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
            ctx.fillRect(cpuX, 10, cpuWidth, canvas.height - 20)

            // Draw Lane Separators
            ctx.strokeStyle = mode === 'optimized' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'
            ctx.beginPath()
            for (let i = 0; i <= coreCount; i++) {
                const y = (i * laneHeight)
                ctx.moveTo(cpuX, y)
                ctx.lineTo(cpuX + cpuWidth, y)
            }
            ctx.stroke()

            // Label
            ctx.fillStyle = '#64748b'
            ctx.font = '10px monospace'
            ctx.fillText('CPU', cpuX + 35, canvas.height - 5)

            if (!isPlaying) {
                // Just draw static particles if paused
                // (Implementation detail: we actually just stop the loop if not playing, 
                // but we need to draw at least once)
            }

            // Update & Draw Particles
            let activeProcessing = 0
            particlesRef.current.forEach(p => {
                if (p.state === 'processing') activeProcessing++
            })

            particlesRef.current.forEach(p => {
                // --- LOGIC ---
                if (isPlaying) {
                    // MOVEMENT
                    if (p.state === 'queued') {
                        // Move towards CPU
                        if (p.x < cpuX - 20) {
                            p.x += 2
                        } else {
                            // At the gate
                            if (mode === 'optimized') {
                                if (activeProcessing < coreCount) {
                                    p.state = 'processing'
                                    p.lane = particlesRef.current.filter(op => op.state === 'processing').length % coreCount
                                    activeProcessing++ // Optimistic count for this frame
                                }
                            } else {
                                // Overloaded: EVERYONE gets in
                                p.state = 'processing'
                                p.lane = p.id % coreCount
                            }
                        }
                    } else if (p.state === 'processing') {
                        // Inside CPU

                        // Speed calculation
                        let moveSpeed = 2 // Base speed

                        // Context Switching Penalty
                        if (mode === 'overloaded') {
                            // Start dragging as more particles enter
                            // For demo visual: if 50 particles, speed approaches 0.1
                            // Real formula: Speed = Base / (TasksPerCore)
                            const penalty = 1 / (Math.max(1, activeProcessing / coreCount))
                            moveSpeed = moveSpeed * penalty
                        }

                        p.x += moveSpeed

                        // Finish
                        if (p.x > cpuX + cpuWidth) {
                            p.state = 'done'
                        }
                    } else if (p.state === 'done') {
                        p.x += 5 // Fly away fast
                        if (p.x > canvas.width + 50) {
                            // Recycle
                            p.x = -20
                            p.state = 'queued'
                        }
                    }

                    // Y-Position Logic
                    // If queued: cluster in a cloud before the gate
                    // If processing: snap to lane y
                    if (p.state === 'queued') {
                        const targetY = (canvas.height / 2) + (Math.sin(p.id + Date.now() / 1000) * 50)
                        p.y += (targetY - p.y) * 0.1
                    } else if (p.state === 'processing' || p.state === 'done') {
                        // Snap to lane center
                        if (p.lane !== undefined) {
                            const laneCenter = (p.lane * laneHeight) + (laneHeight / 2)
                            p.y += (laneCenter - p.y) * 0.1
                        }
                    }
                }

                // --- DRAW ---
                ctx.fillStyle = p.color
                ctx.beginPath()
                ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
                ctx.fill()

                // Jitter effect for overloaded
                if (mode === 'overloaded' && p.state === 'processing' && isPlaying) {
                    p.x += (Math.random() - 0.5) * 2 // Jitter forward/back
                }
            })

            animationRef.current = requestAnimationFrame(render)
        }

        render()

        return () => cancelAnimationFrame(animationRef.current)
    }, [isPlaying, mode, coreCount]) // Re-bind if these change

    return (
        <canvas
            ref={canvasRef}
            width={400}
            height={200}
            className="w-full h-full"
        />
    )
}
