import { LorenzParams, Point3D } from './types';
import * as THREE from 'three';

// Lorenz system derivatives
function lorenzDerivatives(
    p: Point3D,
    sigma: number,
    rho: number,
    beta: number
): Point3D {
    return {
        x: sigma * (p.y - p.x),
        y: p.x * (rho - p.z) - p.y,
        z: p.x * p.y - beta * p.z,
    };
}

// calculate the next point in the Lorenz system using Euler's method
export function calculateNextPointEuler(p: Point3D, params: LorenzParams): Point3D {
    const { sigma, rho, beta, dt } = params;
    const d = lorenzDerivatives(p, sigma, rho, beta);
    return {
        x: p.x + d.x * dt,
        y: p.y + d.y * dt,
        z: p.z + d.z * dt,
    };
}

// calculate the next point in the Lorenz system using Runge-Kutta-Fehlberg (RKF45)
export function calculateNextPointRKF45(p: Point3D, params: LorenzParams): Point3D {
    const { sigma, rho, beta, dt } = params;

    const k1 = lorenzDerivatives(p, sigma, rho, beta);

    const p2: Point3D = {
        x: p.x + dt * (1 / 4) * k1.x,
        y: p.y + dt * (1 / 4) * k1.y,
        z: p.z + dt * (1 / 4) * k1.z,
    };
    const k2 = lorenzDerivatives(p2, sigma, rho, beta);

    const p3: Point3D = {
        x: p.x + dt * ((3 / 32) * k1.x + (9 / 32) * k2.x),
        y: p.y + dt * ((3 / 32) * k1.y + (9 / 32) * k2.y),
        z: p.z + dt * ((3 / 32) * k1.z + (9 / 32) * k2.z),
    };
    const k3 = lorenzDerivatives(p3, sigma, rho, beta);

    const p4: Point3D = {
        x: p.x + dt * ((1932 / 2197) * k1.x - (7200 / 2197) * k2.x + (7296 / 2197) * k3.x),
        y: p.y + dt * ((1932 / 2197) * k1.y - (7200 / 2197) * k2.y + (7296 / 2197) * k3.y),
        z: p.z + dt * ((1932 / 2197) * k1.z - (7200 / 2197) * k2.z + (7296 / 2197) * k3.z),
    };
    const k4 = lorenzDerivatives(p4, sigma, rho, beta);

    const p5: Point3D = {
        x: p.x + dt * ((439 / 216) * k1.x - 8 * k2.x + (3680 / 513) * k3.x - (845 / 4104) * k4.x),
        y: p.y + dt * ((439 / 216) * k1.y - 8 * k2.y + (3680 / 513) * k3.y - (845 / 4104) * k4.y),
        z: p.z + dt * ((439 / 216) * k1.z - 8 * k2.z + (3680 / 513) * k3.z - (845 / 4104) * k4.z),
    };
    const k5 = lorenzDerivatives(p5, sigma, rho, beta);

    const p6: Point3D = {
        x: p.x + dt * (-(8 / 27) * k1.x + 2 * k2.x - (3544 / 2565) * k3.x + (1859 / 4104) * k4.x - (11 / 40) * k5.x),
        y: p.y + dt * (-(8 / 27) * k1.y + 2 * k2.y - (3544 / 2565) * k3.y + (1859 / 4104) * k4.y - (11 / 40) * k5.y),
        z: p.z + dt * (-(8 / 27) * k1.z + 2 * k2.z - (3544 / 2565) * k3.z + (1859 / 4104) * k4.z - (11 / 40) * k5.z),
    };
    const k6 = lorenzDerivatives(p6, sigma, rho, beta);

    // 5th-order solution
    return {
        x: p.x + dt * ((16 / 135) * k1.x + (6656 / 12825) * k3.x + (28561 / 56430) * k4.x - (9 / 50) * k5.x + (2 / 55) * k6.x),
        y: p.y + dt * ((16 / 135) * k1.y + (6656 / 12825) * k3.y + (28561 / 56430) * k4.y - (9 / 50) * k5.y + (2 / 55) * k6.y),
        z: p.z + dt * ((16 / 135) * k1.z + (6656 / 12825) * k3.z + (28561 / 56430) * k4.z - (9 / 50) * k5.z + (2 / 55) * k6.z),
    };
}

// calculates point color based on age
export function calculatePointColor(
    age: number,
    colorScheme: { lighter: string; mid: string; darker: string }
): THREE.Color {
    // aging duration (in seconds)
    const initialDecay = 2;
    const finalDecay = 10;

    const darkerColor = new THREE.Color(colorScheme.darker);
    const midColor = new THREE.Color(colorScheme.mid);
    const lighterColor = new THREE.Color(colorScheme.lighter);

    if (age < initialDecay) {
        const t = age / initialDecay;
        return lighterColor.clone().lerp(midColor, t);
    } else if (age < finalDecay) {
        const t = (age - initialDecay) / (finalDecay - initialDecay);
        return midColor.clone().lerp(darkerColor, t);
    } else {
        return darkerColor.clone();
    }
}

// manages circular buffer for storing trajectory points
export class CircularBuffer {
    positions: Float32Array;
    colors: Float32Array;
    head: number = 0;
    index: number = 0;
    maxPoints: number;

    constructor(maxPoints: number) {
        this.maxPoints = maxPoints;
        this.positions = new Float32Array(maxPoints * 3);
        this.colors = new Float32Array(maxPoints * 3);
    }

    addPoint(point: Point3D): void {
        const idx = this.head;
        this.positions[idx * 3] = point.x;
        this.positions[idx * 3 + 1] = point.y;
        this.positions[idx * 3 + 2] = point.z;

        this.head = (this.head + 1) % this.maxPoints;
        this.index++;
    }

    updateColors(dt: number, colorScheme: { lighter: string; mid: string; darker: string }): void {
        const total = Math.min(this.index, this.maxPoints);

        for (let j = 0; j < total; j++) {
            const bufferIdx = (this.head - 1 - j + this.maxPoints) % this.maxPoints;
            const age = j * dt;
            const color = calculatePointColor(age, colorScheme);

            this.colors[bufferIdx * 3] = color.r;
            this.colors[bufferIdx * 3 + 1] = color.g;
            this.colors[bufferIdx * 3 + 2] = color.b;
        }
    }

    getTotalPoints(): number {
        return Math.min(this.index, this.maxPoints);
    }

    isFull(): boolean {
        return this.index >= this.maxPoints;
    }

    reset(): void {
        this.head = 0;
        this.index = 0;
    }

    resize(newMaxPoints: number): CircularBuffer {
        const newBuffer = new CircularBuffer(newMaxPoints);
        return newBuffer;
    }
}
