import { useState } from 'react';
import { Slider } from '../ui/slider';
import { Settings2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { useLorenzStore } from '@/lib/simulation/store';
import { paramBounds, paramPresets } from '@/lib/simulation/constants';

export default function Parameters() {
    const { currentPreset, loadPreset } = useLorenzStore();
    const presets = Object.keys(paramPresets) as (keyof typeof paramPresets)[];

    return (
        <div className="flex flex-col space-y-8 p-8">
            <div className="flex justify-between">
                <h3 className="text-title flex items-center">
                    <Settings2 className="mr-2 size-5" /> Parameters
                </h3>
                <Tabs
                    defaultValue="classic"
                    value={currentPreset}
                    className="h-8"
                    onValueChange={(val) => loadPreset(val as keyof typeof paramPresets)}
                >
                    <TabsList className="bg-input/50 p-0 rounded border">
                        {presets.map((p) => (
                            <TabsTrigger
                                className="text-xs cursor-pointer data-[state=active]:dark:bg-primary data-[state=active]:dark:text-black rounded"
                                key={p}
                                value={p}
                            >
                                {p.charAt(0).toUpperCase() + p.slice(1)}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>
            <SigmaSlider />
            <RhoSlider />
            <BetaSlider />
            <DeltaTimeSlider />
        </div>
    );
}

export function SigmaSlider() {
    const { params, updateParams } = useLorenzStore();

    return (
        <div className="flex flex-col">
            <div className="flex flex-row justify-between items-center space-y-3">
                <h4>
                    Sigma (<span className="">σ</span>)
                </h4>
                <h4>{params.sigma.toFixed(2)}</h4>
            </div>
            <Slider
                className="[&>span>span>span]:h-1 [&>span>span>span]:w-1 h-1"
                onValueChange={(n) => {
                    updateParams({ sigma: n[0] });
                }}
                defaultValue={[paramPresets.classic.sigma]}
                value={[params.sigma]}
                max={paramBounds.sigma.max}
                step={paramBounds.sigma.step}
            />
        </div>
    );
}

export function RhoSlider() {
    const { params, updateParams } = useLorenzStore();

    return (
        <div className="flex flex-col">
            <div className="flex flex-row justify-between items-center space-y-3">
                <h4>
                    Rho (<span className="">ρ</span>)
                </h4>
                <h4>{params.rho.toFixed(2)}</h4>
            </div>
            <Slider
                className=""
                onValueChange={(n) => {
                    updateParams({ rho: n[0] });
                }}
                defaultValue={[paramPresets.classic.rho]}
                value={[params.rho]}
                max={paramBounds.rho.max}
                step={paramBounds.rho.step}
            />
        </div>
    );
}

export function BetaSlider() {
    const { params, updateParams } = useLorenzStore();

    return (
        <div className="flex flex-col">
            <div className="flex flex-row justify-between items-center space-y-3">
                <h4>Beta (β)</h4>
                <h4>{params.beta.toFixed(2)}</h4>
            </div>
            <Slider
                className=""
                onValueChange={(n) => {
                    updateParams({ beta: n[0] });
                }}
                defaultValue={[paramPresets.classic.beta]}
                value={[params.beta]}
                max={paramBounds.beta.max}
                step={paramBounds.beta.step}
            />
        </div>
    );
}

export function DeltaTimeSlider() {
    const { params, updateParams } = useLorenzStore();

    return (
        <div className="flex flex-col">
            <div className="flex flex-row justify-between items-center space-y-3">
                <h4>Time Step (dt)</h4>
                <h4>{params.dt.toFixed(3)}</h4>
            </div>
            <Slider
                className=""
                onValueChange={(n) => {
                    updateParams({ dt: n[0] });
                }}
                defaultValue={[paramPresets.classic.dt]}
                value={[params.dt]}
                max={paramBounds.dt.max}
                min={paramBounds.dt.min}
                step={paramBounds.dt.step}
            />
        </div>
    );
}
