import * as React from "react";
import { EventCallback } from "./utils";
import type { CompactType, DragOverEvent, Layout, LayoutItem } from "./utils";
import { ResizeHandle, ResizeHandleAxis } from "./types";
export type ResizeHandleAxesType = ("s" | "w" | "e" | "n" | "sw" | "nw" | "se" | "ne")[];
export type ResizeHandleType = React.ReactNode | React.FunctionComponent;
export type Props = React.PropsWithChildren<{
    className: string;
    style: Object;
    width: number;
    autoSize: boolean;
    cols: number;
    draggableCancel: string;
    draggableHandle: string;
    compactType?: CompactType;
    layout: Layout;
    margin?: [number, number];
    containerPadding?: [number, number];
    rowHeight: number;
    maxRows: number;
    isBounded: boolean;
    isDraggable: boolean;
    isResizable: boolean;
    isDroppable: boolean;
    preventCollision: boolean;
    useCSSTransforms: boolean;
    transformScale: number;
    droppingItem: LayoutItem;
    resizeHandles: ResizeHandleAxis[];
    resizeHandle?: ResizeHandle;
    allowOverlap: boolean;
    onLayoutChange: (layout: Layout) => void;
    onDrag: EventCallback;
    onDragStart: EventCallback;
    onDragStop: EventCallback;
    onResize: EventCallback;
    onResizeStart: EventCallback;
    onResizeStop: EventCallback;
    onDropDragOver: (e: DragOverEvent) => ({
        w?: number;
        h?: number;
    } | false) | undefined | void;
    onDrop: (layout: Layout, item?: LayoutItem, e?: React.DragEvent<HTMLDivElement>) => void;
    innerRef?: React.Ref<HTMLDivElement>;
}>;
/**
 * A reactive, fluid grid layout with draggable, resizable components.
 */
declare const ReactGridLayout: {
    (properties: Partial<Props>): JSX.Element;
    displayName: string;
};
export default ReactGridLayout;
