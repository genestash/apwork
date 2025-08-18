export type ApplicationType = {
    id: string;
    name: string;
    icon: string;
    description: string;
    windowType: ApplicationWindowType;
};

export type ApplicationItemType = Partial<ApplicationType> & {
    heading?: 'h1' | 'h2' | 'h3';
    empty?: boolean;
};

export type ApplicationWindowType = 'small' | 'standard' | 'card' | 'fit' | 'wide';
