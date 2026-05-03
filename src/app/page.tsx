'use client';

import MouseMovementListener from '@/components/mouse-movement-listener';
import Panel from '@/components/panel/panel';
import SimulationControls from '@/components/simulation/controls';
import GizmoToggles from '@/components/simulation/gizmo-toggles';
import StatsForNerds from '@/components/simulation/stats-for-nerds';
import SimulationViewPort, { SimulationThreeCanvas } from '@/components/simulation/viewport';
import { useLorenzStore } from '@/lib/simulation/store';
import { cn } from '@/lib/utils';

export default function LorenzAttractor3d() {
    const { hidePanel, autoHideUI, pointerIdle } = useLorenzStore();
    const autoHide = hidePanel && autoHideUI && pointerIdle;

    return (
        <MouseMovementListener className="grid grid-cols-12 h-full overfow-hidden">
            <SimulationViewPort
                className={cn('col-span-12', !hidePanel && 'xl:col-span-8')}
            >
                <SimulationThreeCanvas />
                <div className={cn(autoHide && 'hidden')}>
                    {/* <SiteTitle className="absolute top-8 left-8" /> */}
                    <GizmoToggles className="absolute top-8 right-8" />
                    <SimulationControls className="absolute bottom-8 right-8" />
                    <StatsForNerds className="absolute bottom-8 left-8" />
                </div>
            </SimulationViewPort>
            {!hidePanel && <Panel className="hidden xl:block xl:col-span-4" />}
        </MouseMovementListener>
    );
}
