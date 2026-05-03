import { defaultMaxPoints } from '@/lib/simulation/constants';
import { useLorenzStore } from '@/lib/simulation/store';
import { Point3D } from '@/lib/simulation/types';
import { cn, createFpsCounter } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CircularBuffer } from '@/lib/simulation/lorenz-utils';
import { useCameraControls } from '@/lib/simulation/use-camera-controls';
import { handleReset, updateSimulation } from '@/lib/simulation/engine';
import {
    addHelpers,
    createCamera,
    createLineGeometries,
    createRenderer,
    createScene,
    takeSnapshot,
    updateCamera,
} from '@/lib/simulation/three-utils';

export default function SimulationViewPort({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            {...props}
            className={cn(
                'h-full dark:bg-zinc-950 bg-neutral-600 relative overflow-hidden',
                className
            )}
        >
            {children}
        </div>
    );
}

export function SimulationThreeCanvas() {
    const containerRef = useRef<HTMLDivElement>(null);

    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const lineRef = useRef<THREE.Line | null>(null);
    const line2Ref = useRef<THREE.Line | null>(null);
    const gridRef = useRef<THREE.GridHelper | null>(null);
    const axesRef = useRef<THREE.AxesHelper | null>(null);

    // sim state refs
    const bufferRef = useRef(new CircularBuffer(defaultMaxPoints));
    const currentPointRef = useRef<Point3D>({ x: 0.1, y: 0, z: 0 });

    // store subs
    const { maxPoints, integrationMethod, pointerIdle, autoHideUI, hidePanel } = useLorenzStore();

    const {
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleWheel,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
    } = useCameraControls();
    const getFps = createFpsCounter();

    // handles maxPoint and integration method updates
    useEffect(() => {
        if (maxPoints === bufferRef.current.maxPoints) return;

        bufferRef.current = new CircularBuffer(maxPoints);

        const state = useLorenzStore.getState();
        state.setCurrentPoint({ x: 0, y: 0, z: 0 });
        state.clearPoints();

        // update geometries (if exists)
        if (lineRef.current && line2Ref.current) {
            lineRef.current.geometry.setAttribute(
                'position',
                new THREE.BufferAttribute(bufferRef.current.positions, 3)
            );
            lineRef.current.geometry.setAttribute(
                'color',
                new THREE.BufferAttribute(bufferRef.current.colors, 3)
            );
            line2Ref.current.geometry.setAttribute(
                'position',
                new THREE.BufferAttribute(bufferRef.current.positions, 3)
            );
            line2Ref.current.geometry.setAttribute(
                'color',
                new THREE.BufferAttribute(bufferRef.current.colors, 3)
            );

            handleReset(bufferRef.current, lineRef.current, line2Ref.current, currentPointRef);
        }
    }, [maxPoints]);

    // reset simulation when integration method changes
    useEffect(() => {
        if (!lineRef.current || !line2Ref.current) return;
        handleReset(bufferRef.current, lineRef.current, line2Ref.current, currentPointRef);

        const state = useLorenzStore.getState();
        state.setCurrentPoint({ x: 0, y: 0, z: 0 });
        state.clearPoints();
    }, [integrationMethod]);

    // main three.js setup and animation
    useEffect(() => {
        if (!containerRef.current) return;
        let rafId: number;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        const scene = createScene();
        sceneRef.current = scene;

        const camera = createCamera(width, height);
        cameraRef.current = camera;

        const renderer = createRenderer(width, height);
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const { grid, axes } = addHelpers(scene);
        gridRef.current = grid;
        axesRef.current = axes;

        const { line1, line2 } = createLineGeometries(bufferRef.current);
        scene.add(line1, line2);
        lineRef.current = line1;
        line2Ref.current = line2;

        const observer = new ResizeObserver((entries) => {
            const { width, height } = entries[0].contentRect;

            if (!camera || !renderer) return;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            renderer.setSize(width, height);
            renderer.setPixelRatio(window.devicePixelRatio);
        });
        observer.observe(container);

        const listener = (e: WheelEvent) => e.preventDefault();
        container.addEventListener('wheel', listener, { passive: false });

        const animate = (now: number) => {
            rafId = requestAnimationFrame(animate);

            const state = useLorenzStore.getState();

            if (grid && axes) {
                grid.visible = state.showGrids;
                axes.visible = state.showAxes;
            }

            state.fps = getFps(now);

            if (camera) {
                updateCamera(camera);
            }

            if (state.needsReset && line1 && line2) {
                handleReset(bufferRef.current, line1, line2, currentPointRef);
                state.clearReset();
            }

            if (state.isRunning && line1 && line2) {
                updateSimulation(
                    bufferRef.current,
                    currentPointRef,
                    line1,
                    line2,
                    Math.round(state.speed)
                );
            }

            if (renderer && scene && camera) {
                renderer.render(scene, camera);
            }

            if (state.capturing && line1 && line2) {
                handleSnapshot();
                state.setCapturing(false);
            }
        };

        rafId = requestAnimationFrame(animate);

        return () => {
            observer.disconnect();

            cancelAnimationFrame(rafId);

            container.removeEventListener('wheel', listener);

            if (renderer.domElement.parentNode === container)
                container.removeChild(renderer.domElement);
            renderer.dispose();
            renderer.forceContextLoss();
        };
    }, []);

    const handleSnapshot = () => {
        if (!rendererRef.current || !sceneRef.current || !cameraRef.current) {
            return;
        }

        takeSnapshot(rendererRef.current, sceneRef.current, cameraRef.current);
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                'w-full h-full cursor-grab active:cursor-grabbing select-none touch-none',
                autoHideUI && pointerIdle && hidePanel && 'cursor-none'
            )}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
        />
    );
}
