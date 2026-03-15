import { pathColors } from './constants';

export interface Point3D {
    x: number;
    y: number;
    z: number;
}

export interface LorenzParams {
    sigma: number;
    rho: number;
    beta: number;
    dt: number;
}

export interface CameraAngles {
    theta: number;
    phi: number;
}

export interface CameraPan {
    x: number;
    y: number;
    z: number;
}

export type MaxPointsSelections = 2500 | 5000 | 10000 | 20000 | 30000 | 50000 | 100000;
export type SpeedSelections = 0.5 | 1 | 2;
export type IntegrationMethod = 'euler' | 'rkf45';
