import React from 'react';
type ComposedProps<Config> = {
    measureBeforeMount?: boolean;
    className?: string;
    style?: Object;
    width?: number;
} & Config;
export declare const WidthProvideRGL: <Config>(ComposedComponent: React.ComponentType<Config>) => (props: ComposedProps<Config>) => JSX.Element;
export {};
