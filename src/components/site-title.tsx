import { useLorenzStore } from '@/lib/simulation/store';
import { cn } from '@/lib/utils';

export default function SiteTitle({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                'rounded bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 border',
                className
            )}
            {...props}
        >
            <h4 className="text-body select-none">Lorenz Attractor Simulation</h4>
        </div>
    );
}
