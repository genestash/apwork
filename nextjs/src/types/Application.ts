export type ApplicationType = {
    id: string;
    name: string;
    icon: string;
    description: string;
    windowType: ApplicationWindowType;
    includeInstruction: boolean;
};

export type ApplicationItemType = Partial<ApplicationType> & {
    heading?: 'h1' | 'h2' | 'h3';
    empty?: boolean;
};

export type ApplicationWindowType = 'min' | 'mid' | 'max' | 'card';
