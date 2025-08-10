export type ApplicationItemDto = {
    id?: string;
    name?: string;
    icon?: string;
    converter?: { from: string; to: string };
    windowType?: ApplicationWindowType;
    description?: string;
    hide?: boolean;
    empty?: boolean;
    heading?: 'h1' | 'h2' | 'h3';
};

export type ApplicationWindowType = 'small' | 'standard' | 'card' | 'fit' | 'wide';
