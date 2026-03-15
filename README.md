# Lorenz Attractor 3D Simulation

A real-time 3D visualization of the Lorenz attractor built with React, Next.js, and Three.js.

## Features

- Real-time 3D rendering with interactive orbital camera controls
- Adjustable parameters (σ, ρ, β, dt) and simulation speed
- Dynamic trail rendering up to 30,000 points
- Multiple color gradient schemes
- Grid and axes helpers
- Euler's method / RKF45 integration method options

## Getting Started

### Prerequisites

- Node.js 18+

### Installation

```bash
git clone https://github.com/yourusername/lorenz-attractor-simulation.git
cd lorenz-attractor-simulation
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Controls

- **Orbit**: Click and drag
- **Pan**: Shift + drag
- **Roll**: Alt + drag
- **Zoom**: Scroll wheel

## The Lorenz System

```
dx/dt = σ(y - x)
dy/dt = x(ρ - z) - y
dz/dt = xy - βz
```

Classic parameters: σ=10, ρ=28, β=8/3

Try varying ρ to explore different dynamical regimes:

- ρ < 1: Fixed point
- 1 < ρ < 24.74: Periodic orbits
- ρ > 24.74: Chaotic behavior

---

**Author**: [@rubiokittsrey](https://github.com/rubiokittsrey)
