import { cn } from '@/lib/utils';
import { CopyrightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import About from './about';
import Parameters from './parameters';
import Preferences from './settings';
import Visualization from './visualization';

export default function Panel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
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
