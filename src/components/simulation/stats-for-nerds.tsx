import { useLorenzStore } from '@/lib/simulation/store';
import { cn } from '@/lib/utils';
import Stats from 'stats.js';

export default function StatsForNerds({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    const { hideStats } = useLorenzStore();
    if (hideStats) return null;

    return (
        <div className={cn('flex flex-col space-y-5 pointer-events-none', className)} {...props}>
            <div className="flex flex-col space-y-3 bg-input/50 p-3 border rounded w-fit pointer-events-auto">
                <PointsDataLength />
                <FPSDisplay />
                <RenderSpeed />
                <XYZPoints />
            </div>
            <CameraInformation />
        </div>
    );
}

export function XYZPoints() {
    const { currentPoint } = useLorenzStore();
    return (
        <div className="flex flex-row space-x-3">
            {Object.keys(currentPoint).map((p) => (
                <div
                    key={p}
                    className="rounded bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 border"
                >
                    <h4 className="text-body select-none">{`${p.toUpperCase()}: ${currentPoint[p as keyof typeof currentPoint]}`}</h4>
                </div>
            ))}
        </div>
    );
}

export function PointsDataLength() {
    const { pointsData } = useLorenzStore();
    return (
        <div className="rounded w-fit bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 border">
            <h4 className="text-body select-none">{`Points: ${pointsData.length}`}</h4>
        </div>
    );
}

export function FPSDisplay() {
    const { fps } = useLorenzStore();
    return (
        <div className="rounded w-fit bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 border">
            <h4 className="text-body select-none">{`FPS: ${fps}`}</h4>
        </div>
    );
}

export function RenderSpeed() {
    const { speed } = useLorenzStore();
    return (
        <div className="rounded w-fit bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 border">
            <h4 className="text-body select-none">{`Render Speed: ${speed} step(s) per frame`}</h4>
        </div>
    );
}

export function CameraInformation() {
    const { hideCamInfo } = useLorenzStore();

    if (hideCamInfo) return null;

    return (
        <div className="flex flex-col space-y-3 bg-input/50 p-3 border rounded pointer-events-auto">
            <h4 className="text-body select-none">Camera Information</h4>
            <CameraPosition />
            <CameraAngles />
            <CameraPan />
            <CameraRoll />
        </div>
    );
}

export function CameraAngles() {
    const { cameraAngles } = useLorenzStore();
    return (
        <div className="rounded w-fit bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 border">
            <h4 className="text-body select-none">{`Angles: ${cameraAngles.phi} ${cameraAngles.theta}`}</h4>
        </div>
    );
}

export function CameraPosition() {
    const { cameraPosition } = useLorenzStore();
    return (
        <div className="rounded w-fit bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 border">
            <h4 className="text-body select-none">{`Position (x,y,z): ${cameraPosition.x}, ${cameraPosition.y}, ${cameraPosition.z}`}</h4>
        </div>
    );
}

export function CameraPan() {
    const { cameraPan } = useLorenzStore();

    return (
        <div className="rounded w-fit bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 border">
            <h4 className="text-body select-none">{`Pan (x,y,z): ${cameraPan.x}, ${cameraPan.y}, ${cameraPan.z}`}</h4>
        </div>
    );
}

export function CameraRoll() {
    const { cameraRoll } = useLorenzStore();

    return (
        <div className="rounded w-fit bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 border">
            <h4 className="text-body select-none">{`Roll: ${cameraRoll}`}</h4>
        </div>
    );
}
