export type ApplicationType = {
    id: string;
    name: string;
    icon: string;
    description: string;
    windowType: ApplicationWindowType;
    includeInstruction: boolean;
};

export type ApplicationWindowType = 'min' | 'mid' | 'max' | 'card';
