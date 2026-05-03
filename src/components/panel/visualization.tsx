import { CheckIcon, EllipsisIcon, MinusIcon, PaletteIcon, PipetteIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { pathColors } from '@/lib/simulation/constants';
import { useLorenzStore } from '@/lib/simulation/store';

export default function Visualization() {
    const [displayMode, setDisplayMode] = useState<'line' | 'dots'>('line');

    return (
        <div className="flex flex-col space-y-8 p-8">
            <div className="flex justify-between">
                <h3 className="text-title flex items-center">
                    <PaletteIcon className="mr-2 size-5" /> Visualization
                </h3>
            </div>
            <PathColor />
            <DisplayMode />
        </div>
    );
}

export function PathColor() {
    const { color, setColor } = useLorenzStore();
    const pathColorsKeys = Object.keys(pathColors) as (keyof typeof pathColors)[];

    return (
        <div className="flex flex-col space-y-3">
            <h4>Path Color</h4>
            <div className="flex space-x-2">
                {pathColorsKeys.map((c) => (
                    <button
                        key={c}
                        className={cn(
                            'size-8 rounded cursor-pointer flex items-center justify-center',
                            pathColors[c].className
                        )}
                        onClick={() => {
                            setColor(c);
                        }}
                    >
                        {c === color && <CheckIcon className="stroke-2 size-5" />}
                    </button>
                ))}
                {/* <button
                        className={cn(
                            'size-8 rounded cursor-pointer flex items-center justify-center bg-neutral-600'
                        )}
                        onClick={() => {}}
                    >
                        <PipetteIcon className="size-4" />
                    </button> */}
            </div>
        </div>
    );
}

export function DisplayMode() {
    const { visualMode, setVisualMode } = useLorenzStore();

    return (
        <div className="flex flex-col space-y-3">
            <h4>Display Mode</h4>
            <div className="flex space-x-3">
                <Button
                    onClick={() => setVisualMode('line')}
                    variant={visualMode === 'line' ? 'default' : 'outline'}
                    className="border"
                >
                    Line <MinusIcon />
                </Button>
                <Button
                    onClick={() => setVisualMode('dots')}
                    variant={visualMode === 'dots' ? 'default' : 'outline'}
                    className="border"
                    disabled
                >
                    Dots <EllipsisIcon />
                </Button>
            </div>
        </div>
    );
}
