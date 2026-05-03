import { useRef } from 'react';
import { useLorenzStore } from './store';
import * as THREE from 'three';

// TODO: camera controls are a little wonky; improve them later

export function useCameraControls() {
    const isDraggingRef = useRef(false);
    const isPanningRef = useRef(false);
    const isRollingRef = useRef(false);
    const lastMouseRef = useRef({ x: 0, y: 0 });

    const touchModeRef = useRef<'none' | 'orbit' | 'pan-zoom'>('none');
    const lastTouchDistanceRef = useRef(0);
    const lastTouchAngleRef = useRef(0);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.button !== 0) return;
        lastMouseRef.current = { x: e.clientX, y: e.clientY };
        if (e.shiftKey) isPanningRef.current = true;
        else if (e.altKey) isRollingRef.current = true;
        else isDraggingRef.current = true;
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        const dx = e.clientX - lastMouseRef.current.x;
        const dy = e.clientY - lastMouseRef.current.y;

        const {
            cameraAngles,
            cameraPan,
            setCameraAngles,
            setCameraPan,
            setCameraRoll,
            cameraRoll,
            cameraBasisVectors,
        } = useLorenzStore.getState();

        // approximate, instead of change angle by camera view plane, rotate mouse delta by roll angle to simplify
        if (isDraggingRef.current) {
            const cosR = Math.cos(-cameraRoll);
            const sinR = Math.sin(-cameraRoll);

            const dxScreen = dx * cosR - dy * sinR;
            const dyScreen = dx * sinR + dy * cosR;

            setCameraAngles({
                theta: cameraAngles.theta + dxScreen * 0.01,
                phi: Math.max(0.1, Math.min(Math.PI - 0.1, cameraAngles.phi + dyScreen * 0.01)),
            });
        }

        if (isPanningRef.current) {
            const panSpeed = 0.3;

            // offset panning to pan along the camera's view plane instead of the world's plane
            const panOffset = new THREE.Vector3();
            panOffset.addScaledVector(cameraBasisVectors.right, -dx * panSpeed);
            panOffset.addScaledVector(cameraBasisVectors.up, dy * panSpeed);

            setCameraPan({
                x: cameraPan.x + panOffset.x,
                y: cameraPan.y + panOffset.y,
                z: cameraPan.z + panOffset.z,
            });
        }

        if (isRollingRef.current) {
            const rollSpeed = 0.01;
            setCameraRoll(cameraRoll + dx * rollSpeed);
        }

        lastMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        isDraggingRef.current = false;
        isPanningRef.current = false;
        isRollingRef.current = false;
    };

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        // e.preventDefault();
        const { cameraDistance, setCameraDistance } = useLorenzStore.getState();
        const delta = e.deltaY > 0 ? 5 : -5;
        setCameraDistance(Math.max(50, Math.min(400, cameraDistance + delta)));
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        if (e.touches.length === 1) {
            touchModeRef.current = 'orbit';
            lastMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        } else if (e.touches.length >= 2) {
            touchModeRef.current = 'pan-zoom';
            const t1 = e.touches[0];
            const t2 = e.touches[1];
            lastMouseRef.current = {
                x: (t1.clientX + t2.clientX) / 2,
                y: (t1.clientY + t2.clientY) / 2,
            };
            lastTouchDistanceRef.current = Math.hypot(
                t2.clientX - t1.clientX,
                t2.clientY - t1.clientY
            );
            lastTouchAngleRef.current = Math.atan2(
                t2.clientY - t1.clientY,
                t2.clientX - t1.clientX
            );
        }
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        const {
            cameraAngles,
            cameraPan,
            setCameraAngles,
            setCameraPan,
            cameraRoll,
            setCameraRoll,
            cameraBasisVectors,
            cameraDistance,
            setCameraDistance,
        } = useLorenzStore.getState();

        if (touchModeRef.current === 'orbit' && e.touches.length === 1) {
            const t = e.touches[0];
            const dx = t.clientX - lastMouseRef.current.x;
            const dy = t.clientY - lastMouseRef.current.y;

            const cosR = Math.cos(-cameraRoll);
            const sinR = Math.sin(-cameraRoll);
            const dxScreen = dx * cosR - dy * sinR;
            const dyScreen = dx * sinR + dy * cosR;

            setCameraAngles({
                theta: cameraAngles.theta + dxScreen * 0.01,
                phi: Math.max(0.1, Math.min(Math.PI - 0.1, cameraAngles.phi + dyScreen * 0.01)),
            });

            lastMouseRef.current = { x: t.clientX, y: t.clientY };
        } else if (touchModeRef.current === 'pan-zoom' && e.touches.length >= 2) {
            const t1 = e.touches[0];
            const t2 = e.touches[1];
            const cx = (t1.clientX + t2.clientX) / 2;
            const cy = (t1.clientY + t2.clientY) / 2;
            const distance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);

            const dx = cx - lastMouseRef.current.x;
            const dy = cy - lastMouseRef.current.y;
            const panSpeed = 0.3;
            const panOffset = new THREE.Vector3();
            panOffset.addScaledVector(cameraBasisVectors.right, -dx * panSpeed);
            panOffset.addScaledVector(cameraBasisVectors.up, dy * panSpeed);
            setCameraPan({
                x: cameraPan.x + panOffset.x,
                y: cameraPan.y + panOffset.y,
                z: cameraPan.z + panOffset.z,
            });

            const distDelta = lastTouchDistanceRef.current - distance;
            const zoomSpeed = 0.5;
            setCameraDistance(
                Math.max(50, Math.min(400, cameraDistance + distDelta * zoomSpeed))
            );

            const angle = Math.atan2(t2.clientY - t1.clientY, t2.clientX - t1.clientX);
            let angleDelta = angle - lastTouchAngleRef.current;
            if (angleDelta > Math.PI) angleDelta -= 2 * Math.PI;
            if (angleDelta < -Math.PI) angleDelta += 2 * Math.PI;
            setCameraRoll(cameraRoll + angleDelta);

            lastMouseRef.current = { x: cx, y: cy };
            lastTouchDistanceRef.current = distance;
            lastTouchAngleRef.current = angle;
        }
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
        if (e.touches.length === 0) {
            touchModeRef.current = 'none';
        } else if (e.touches.length === 1) {
            touchModeRef.current = 'orbit';
            lastMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
    };

    return {
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleWheel,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
    };
}
