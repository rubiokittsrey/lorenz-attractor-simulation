import { CircleQuestionMarkIcon, CopyrightIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { maxPointsOptions } from '@/lib/simulation/constants';

export default function About() {
    const tabs = ['project', 'lorenz', 'guide'];

    return (
        <div className="flex flex-col space-y-8 p-8">
            <div className="flex justify-between">
                <h3 className="text-title flex items-center">
                    <CircleQuestionMarkIcon className="mr-2 size-5" /> About
                </h3>
            </div>

            <Tabs defaultValue="project" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-input/50 p-0 rounded border h-8">
                    {tabs.map((t) => (
                        <TabsTrigger
                            key={t}
                            value={t}
                            className="rounded data-[state=active]:dark:bg-primary data-[state=active]:dark:text-black cursor-pointer"
                        >
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="project">
                    <ProjectTab />
                </TabsContent>

                <TabsContent value="lorenz">
                    <LorenzAttractorTab />
                </TabsContent>

                <TabsContent value="guide">
                    <GuideTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}

export function ProjectTab() {
    return (
        <div className="space-y-4 mt-4">
            <p>
                A real-time 3D Lorenz attractor built with React, Next.js, and Three.js. The scene
                is rendered with WebGL and designed to stay smooth even with long trajectory trails.
            </p>

            <div className="space-y-2">
                <p className="font-semibold">Features:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Interactive 3D camera controls</li>
                    <li>Adjustable parameters (σ, ρ, β, dt) and simulation speed</li>
                    <li>
                        Trail rendering up to {maxPointsOptions[maxPointsOptions.length - 1]} points
                    </li>
                    <li>Multiple color gradient options</li>
                    <li>Grid and axes helpers</li>
                </ul>
            </div>
        </div>
    );
}

export function LorenzAttractorTab() {
    return (
        <div className="space-y-4 mt-4">
            <p>
                The Lorenz attractor comes from a system of three equations discovered by Edward
                Lorenz in 1963 while studying atmospheric convection. It is a classic example of
                chaotic behavior.
            </p>

            <div className="bg-muted p-4 rounded-md font-mono text-body space-y-1">
                <div>dx/dt = σ(y - x)</div>
                <div>dy/dt = x(ρ - z) - y</div>
                <div>dz/dt = xy - βz</div>
            </div>

            <p>
                Small changes in starting conditions lead to very different paths, but the system
                always forms the same butterfly-shaped structure in 3D space.
            </p>

            <p>
                Classic parameters: σ=10, ρ=28, β=8/3. Varying ρ reveals fixed, periodic, and
                chaotic regimes.
            </p>
        </div>
    );
}

export function GuideTab() {
    return (
        <div className="space-y-4 mt-4">
            <div>
                <p className="font-semibold mb-2">Camera:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Drag — Orbit</li>
                    <li>Shift + Drag — Pan</li>
                    <li>Alt + Drag — Roll</li>
                    <li>Scroll — Zoom</li>
                </ul>
            </div>

            <div>
                <p className="font-semibold mb-2">Simulation:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Play / Pause</li>
                    <li>Reset trail</li>
                    <li>Adjust speed (steps per frame)</li>
                </ul>
            </div>

            <div>
                <p className="font-semibold mb-2">Parameters:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>σ, ρ, β — Change system behavior</li>
                    <li>dt — Integration step size</li>
                    <li>Max Points — Trail length</li>
                </ul>
            </div>

            <div>
                <p className="font-semibold mb-2">Tips:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-body">
                    <li>Start with σ=10, ρ=28, β=8/3</li>
                    <li>Change ρ (20–30) to explore different regimes</li>
                    <li>Rotate the camera to see the full 3D structure</li>
                </ul>
            </div>
        </div>
    );
}
