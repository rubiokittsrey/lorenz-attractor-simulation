import { create } from 'zustand';
import {
    Point3D,
    LorenzParams,
    CameraAngles,
    CameraPan,
    MaxPointsSelections,
    SpeedSelections,
    IntegrationMethod,
} from './types';
import {
    initialCameraAngles,
    initialCameraDistance,
    initialCameraPan,
    initialColor,
    initialPoint,
    defaultMaxPoints,
    paramPresets,
    pathColors,
} from './constants';
import { Vector3 } from 'three';

interface LorenzSimulationStates {
    params: LorenzParams;
    currentPreset: keyof typeof paramPresets | '';
    isRunning: boolean;
    currentPoint: Point3D;
    pointsData: Point3D[];
    needsReset: boolean;

    //misc
    fps: number | undefined;
    speed: SpeedSelections;
    setSpeed: (speed: SpeedSelections) => void;
}

interface CameraStates {
    cameraDistance: number;
    cameraAngles: CameraAngles;
    cameraPan: CameraPan;
    cameraRoll: number;
    cameraPosition: Point3D;
    cameraBasisVectors: { right: Vector3; up: Vector3; forward: Vector3 };
    capturing: boolean;
}

interface VisualizationStates {
    visualMode: 'line' | 'dots';
    dotSize: number;
    color: keyof typeof pathColors;
    showGrids: boolean;
    showAxes: boolean;
}

interface LorenzSimulationActions {
    updateParams: (params: Partial<LorenzParams>) => void;
    clearPreset: () => void;

    toggleIsRunning: () => void;
    setCurrentPoint: (point: Point3D) => void;
    addPoint: (point: Point3D) => void;
    clearPoints: () => void;

    requestReset: () => void;
    clearReset: () => void;
    loadPreset: (preset: 'classic' | 'complex' | 'stable') => void;
}

interface CameraActions {
    setCameraDistance: (distance: number) => void;
    setCameraAngles: (angles: CameraAngles) => void;
    setCameraPan: (pan: CameraPan) => void;
    setCameraRoll: (roll: number) => void;
    resetCamera: () => void;
    updateCameraPosition: (position: Point3D) => void;
    updateCameraBasisVectors: (right: Vector3, up: Vector3, forward: Vector3) => void;
    setCapturing: (t: boolean) => void;
}

interface VisualizationActions {
    setVisualMode: (mode: 'line' | 'dots') => void;
    setDotSize: (size: number) => void;
    toggleGrids: () => void;
    toggleAxes: () => void;
    setColor: (color: keyof typeof pathColors) => void;
}

interface Preferences {
    autoHideUI: boolean;
    hidePanel: boolean;
    hideStats: boolean;
    hideCamInfo: boolean;
    maxPoints: MaxPointsSelections;
    integrationMethod: IntegrationMethod;

    toggleAutoHideUI: () => void;
    toggleStats: () => void;
    toggleCamInfo: () => void;
    setMaxPoints: (points: MaxPointsSelections) => void;
    setIntegrationMethod: (method: IntegrationMethod) => void;
    togglePanel: () => void;

    //misc
    pointerIdle: boolean;
    setPointerIdle: (t: boolean) => void;
}

export type LorenzStore = LorenzSimulationStates &
    LorenzSimulationActions &
    CameraStates &
    CameraActions &
    VisualizationStates &
    VisualizationActions &
    Preferences;

export const useLorenzStore = create<LorenzStore>((set, get) => ({
    params: paramPresets.classic,
    isRunning: true,
    currentPoint: initialPoint,
    pointsData: [],

    cameraDistance: initialCameraDistance,
    cameraAngles: initialCameraAngles,
    cameraPan: initialCameraPan,

    visualMode: 'line',
    dotSize: 0.3,
    showGrids: false,
    showAxes: false,
    color: initialColor,

    fps: undefined,

    updateParams: (params) =>
        set((state) => ({
            params: { ...state.params, ...params },
            currentPreset: '',
        })),

    toggleIsRunning: () => set((state) => ({ isRunning: !state.isRunning })),

    setCurrentPoint: (point) => set({ currentPoint: point }),
    addPoint: (point) =>
        set((state) => {
            const newPoints = [...state.pointsData, point];
            if (newPoints.length > state.maxPoints) {
                newPoints.shift();
            }
            return { pointsData: newPoints };
        }),
    clearPoints: () => set({ pointsData: [] }),

    setCameraDistance: (distance) => set({ cameraDistance: distance }),
    setCameraAngles: (angles) => set({ cameraAngles: angles }),
    setCameraPan: (pan) => set({ cameraPan: pan }),
    resetCamera: () =>
        set({
            cameraAngles: initialCameraAngles,
            cameraDistance: initialCameraDistance,
            cameraPan: initialCameraPan,
            cameraRoll: 0,
        }),
    cameraPosition: { x: 0, y: 0, z: 0 },
    updateCameraPosition: (position) => set({ cameraPosition: position }),
    cameraBasisVectors: { right: new Vector3(), up: new Vector3(), forward: new Vector3() },
    updateCameraBasisVectors: (right, up, forward) =>
        set({ cameraBasisVectors: { right, up, forward } }),
    cameraRoll: 0,
    setCameraRoll: (roll) => set({ cameraRoll: roll }),

    setVisualMode: (mode) => set({ visualMode: mode }),
    setDotSize: (size) => set({ dotSize: size }),
    toggleGrids: () => set((state) => ({ showGrids: !state.showGrids })),
    toggleAxes: () => set((state) => ({ showAxes: !state.showAxes })),
    setColor: (color) => set({ color }),

    needsReset: false,
    requestReset: () => set({ needsReset: true, isRunning: false }),
    clearReset: () =>
        set({ needsReset: false, currentPoint: { x: 0, y: 0, z: 0 }, pointsData: [] }),

    currentPreset: 'classic',
    loadPreset: (preset) =>
        set({
            params: paramPresets[preset],
            currentPreset: preset,
        }),
    clearPreset: () => set({ currentPreset: '' }),

    autoHideUI: false,
    hideStats: true,
    maxPoints: defaultMaxPoints,
    integrationMethod: 'euler',
    toggleAutoHideUI: () => set((state) => ({ autoHideUI: !state.autoHideUI })),
    toggleStats: () => set((state) => ({ hideStats: !state.hideStats })),
    setMaxPoints: (points) => set({ maxPoints: points }),
    setIntegrationMethod: (method) => set({ integrationMethod: method }),

    speed: 1,
    setSpeed: (speed: SpeedSelections) => set({ speed }),

    hidePanel: false,
    togglePanel: () => set((state) => ({ hidePanel: !state.hidePanel })),

    hideCamInfo: true,
    toggleCamInfo: () => set((state) => ({ hideCamInfo: !state.hideCamInfo })),

    pointerIdle: false,
    setPointerIdle: (t) => set({ pointerIdle: t }),

    capturing: false,
    setCapturing: (t) => set({ capturing: t }),
}));
