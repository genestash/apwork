export type ApplicationType = {
    id: string;
    name: string;
    icon: string;
    description: string;
    windowSize: ApplicationWindowSize;
    windowRatio?: ApplicationWindowRatio;
    includeInstruction?: boolean;
};

export type ApplicationWindowSize = 'min' | 'mid' | 'max';
export type ApplicationWindowRatio = '1.5';
