import { CircleQuestionMarkIcon, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Switch } from '../ui/switch';
import { useTheme } from 'next-themes';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { IntegrationMethod, MaxPointsSelections } from '@/lib/simulation/types';
import { maxPointsOptions } from '@/lib/simulation/constants';
import { useLorenzStore } from '@/lib/simulation/store';

export default function Preferences() {
    return (
        <div className="flex flex-col space-y-8 p-8">
            <div className="flex justify-between">
                <h3 className="text-lg flex items-center">
                    <Settings className="mr-2 size-5" /> Preferences
                </h3>
            </div>
            <div className="flex flex-col space-y-3">
                <AutoHideSwitch />
                <ShowStatsSwitch />
                <ShowCameraInformationSwitch />
                <ThemeSwitch />
            </div>
            <MaxPoints />
            <IntegrationMethodSelector />
        </div>
    );
}

export function ShowStatsSwitch() {
    const { hideStats, toggleStats } = useLorenzStore();

    return (
        <div className="flex flex-row space-x-3 items-center">
            <Switch checked={!hideStats} onCheckedChange={toggleStats} size="sm" />
            <p>Show stats for nerds</p>
        </div>
    );
}

export function ShowCameraInformationSwitch() {
    const { hideStats, toggleCamInfo, hideCamInfo } = useLorenzStore();

    if (hideStats) return null;

    return (
        <div className="flex flex-row space-x-3 items-center">
            <Switch checked={!hideCamInfo} onCheckedChange={toggleCamInfo} size="sm" />
            <p>Show camera information</p>
        </div>
    );
}

export function AutoHideSwitch() {
    const { autoHideUI, toggleAutoHideUI } = useLorenzStore();

    return (
        <div className="flex flex-row space-x-3 items-center">
            <Switch checked={autoHideUI} onCheckedChange={toggleAutoHideUI} size="sm" />
            <p>Auto-hide UI on panel closed</p>
        </div>
    );
}

export function ThemeSwitch() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="flex flex-row space-x-3 items-center">
            <Switch
                checked={theme === 'dark'}
                onCheckedChange={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
                size="sm"
            />
            <p>Dark Mode</p>
        </div>
    );
}

export function MaxPoints() {
    const { maxPoints, setMaxPoints } = useLorenzStore();

    return (
        <div className="flex flex-col space-y-3">
            <div className="flex flex-row space-x-3 items-center">
                <p>Max Points</p>
                <HoverCard openDelay={0} closeDelay={0}>
                    <HoverCardTrigger asChild>
                        <CircleQuestionMarkIcon className="size-4" />
                    </HoverCardTrigger>
                    <HoverCardContent className="font-sans flex flex-col space-y-2">
                        <p className="text-sm">Maximum Rendered Points</p>
                        <p className="text-xs opacity-50">
                            This value controls how many points are rendered in the simulation at
                            once. Increasing it may impact performance.
                        </p>
                        <p className="text-xs opacity-50 text-orange-400">
                            Updating the maximum rendered points will reset the animation.
                        </p>
                    </HoverCardContent>
                </HoverCard>
            </div>
            <Tabs
                value={maxPoints.toString()}
                onValueChange={(v) => setMaxPoints(Number(v) as MaxPointsSelections)}
                className="w-full "
            >
                <TabsList className="grid grid-cols-7 w-full bg-input/50 p-0 rounded border h-8">
                    {maxPointsOptions.map((points) => (
                        <TabsTrigger
                            key={points}
                            value={points.toString()}
                            className="rounded data-[state=active]:dark:bg-primary data-[state=active]:dark:text-black cursor-pointer"
                        >
                            {points >= 1000 ? `${points / 1000}k` : points}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
        </div>
    );
}

const integrationMethods: { value: IntegrationMethod; label: string }[] = [
    { value: 'euler', label: "Euler's" },
    { value: 'rkf45', label: 'RKF45' },
];

export function IntegrationMethodSelector() {
    const { integrationMethod, setIntegrationMethod } = useLorenzStore();

    return (
        <div className="flex flex-col space-y-3">
            <div className="flex flex-row space-x-3 items-center">
                <p>Integration Method</p>
                <HoverCard openDelay={0} closeDelay={0}>
                    <HoverCardTrigger asChild>
                        <CircleQuestionMarkIcon className="size-4" />
                    </HoverCardTrigger>
                    <HoverCardContent className="font-sans flex flex-col space-y-2">
                        <p className="text-sm">Numerical Integration Method</p>
                        <p className="text-xs opacity-50">
                            Euler&apos;s method is fast but less accurate. RKF45
                            (Runge-Kutta-Fehlberg) is more accurate at the cost of additional
                            computation per step.
                        </p>
                        <p className="text-xs opacity-50 text-orange-400">
                            Changing the integration method will reset the animation.
                        </p>
                    </HoverCardContent>
                </HoverCard>
            </div>
            <Tabs
                value={integrationMethod}
                onValueChange={(v) => setIntegrationMethod(v as IntegrationMethod)}
                className="w-full"
            >
                <TabsList className="grid grid-cols-2 w-full bg-input/50 p-0 rounded border h-8">
                    {integrationMethods.map((method) => (
                        <TabsTrigger
                            key={method.value}
                            value={method.value}
                            className="rounded data-[state=active]:dark:bg-primary data-[state=active]:dark:text-black cursor-pointer"
                        >
                            {method.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
        </div>
    );
}
