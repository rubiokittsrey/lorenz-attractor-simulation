'use client';

import MouseMovementListener from '@/components/mouse-movement-listener';
import About from '@/components/panel/about';
import Parameters from '@/components/panel/parameters';
import Preferences from '@/components/panel/settings';
import Visualization from '@/components/panel/visualization';
import SimulationControls from '@/components/simulation/controls';
import GizmoToggles from '@/components/simulation/gizmo-toggles';
import StatsForNerds from '@/components/simulation/stats-for-nerds';
import SimulationViewPort, { SimulationThreeCanvas } from '@/components/simulation/viewport';
import SiteTitle from '@/components/site-title';
import { Button } from '@/components/ui/button';
import { useLorenzStore } from '@/lib/simulation/store';
import { cn } from '@/lib/utils';
import { CopyrightIcon } from 'lucide-react';

export default function LorenzAttractor3d() {
    const { hidePanel, autoHideUI, pointerIdle } = useLorenzStore();
    const autoHide = hidePanel && autoHideUI && pointerIdle;

    return (
        <MouseMovementListener className="grid grid-cols-12 h-full overfow-hidden">
            <SimulationViewPort className={hidePanel ? 'col-span-12' : 'col-span-8'}>
                <SimulationThreeCanvas />
                <div className={cn(autoHide && 'hidden')}>
                    {/* <SiteTitle className="absolute top-8 left-8" /> */}
                    <GizmoToggles className="absolute top-8 right-8" />
                    <SimulationControls className="absolute bottom-8 right-8" />
                    <StatsForNerds className="absolute bottom-8 left-8" />
                </div>
            </SimulationViewPort>
            {!hidePanel && <Panel className="col-span-4" />}
        </MouseMovementListener>
    );
}

function Panel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('h-full overflow-y-auto', className)} {...props}>
            <Parameters />
            <hr className="border-t border-gray-400/50 dark:border-neutral-600/50 mt-3 mb-1" />
            <Visualization />
            <hr className="border-t border-gray-400/50 dark:border-neutral-600/50 mt-3 mb-1" />
            <Preferences />
            <hr className="border-t border-gray-400/50 dark:border-neutral-600/50 mt-3 mb-1" />
            <About />
            <hr className="border-t border-gray-400/50 dark:border-neutral-600/50 mt-3 mb-1" />
            <PanelCopyrightSection />
        </div>
    );
}

function PanelCopyrightSection() {
    return (
        <div className="flex justify-between">
            <p className="flex items-center opacity-30 p-2 px-8 mb-2">
                <CopyrightIcon className="size-4 mr-2 text-xs" /> {new Date().getFullYear()}
            </p>
            <Button variant={'link'} className="flex items-center opacity-30 p-2 px-8 mb-2">
                rubiokittsrey.dev
            </Button>
        </div>
    );
}
