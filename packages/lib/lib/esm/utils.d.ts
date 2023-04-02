import React, { ReactNode } from "react";
export type LayoutItem = {
    w: number;
    h: number;
    x: number;
    y: number;
    z?: number;
    i: string;
    minW?: number;
    minH?: number;
    maxW?: number;
    maxH?: number;
    moved?: boolean;
    static?: boolean;
    isDraggable?: boolean;
    isResizable?: boolean;
    resizeHandles?: Array<"s" | "w" | "e" | "n" | "sw" | "nw" | "se" | "ne">;
    isBounded?: boolean;
};
export type Layout = LayoutItem[];
export type Position = {
    left: number;
    top: number;
    z: number;
    width: number;
    height: number;
};
export type ReactDraggableCallbackData = {
    node: HTMLElement;
    x?: number;
    y?: number;
    deltaX: number;
    deltaY: number;
    lastX?: number;
    lastY?: number;
};
export type PartialPosition = {
    left: number;
    top: number;
};
export type DroppingPosition = {
    left: number;
    top: number;
    e: React.DragEvent<HTMLDivElement>;
};
export type Size = {
    width: number;
    height: number;
};
export type GridDragEvent = {
    e: Event;
    node: HTMLElement;
    newPosition: PartialPosition;
};
export type GridDragStopEvent = GridDragEvent & {
    change: boolean;
};
export type GridResizeEvent = {
    e: Event;
    node: HTMLElement;
    size: Size;
};
export type DragOverEvent = MouseEvent & {
    nativeEvent: {
        layerX: number;
        layerY: number;
    } & Event;
};
export type ReactChildren = ReactNode;
export type EventCallback = (layout: Layout, oldItem?: LayoutItem, newItem?: LayoutItem, placeholder?: LayoutItem, event?: Event, node?: HTMLElement) => void;
export type CompactType = "horizontal" | "vertical" | undefined;
/**
 * Return the bottom coordinate of the layout.
 *
 * @param  {Array} layout Layout array.
 * @return {Number}       Bottom coordinate.
 */
export declare function bottom(layout: Layout): number;
export declare function cloneLayout(layout: Layout): Layout;
export declare function modifyLayout(layout: Layout, layoutItem: LayoutItem): Layout;
export declare function withLayoutItem(layout: Layout, itemKey: string, cb: (l: LayoutItem) => LayoutItem): [Layout, LayoutItem | null];
export declare function cloneLayoutItem(layoutItem: LayoutItem): LayoutItem;
/**
 * Comparing React `children` is a bit difficult. This is a good way to compare them.
 * This will catch differences in keys, order, and length.
 */
export declare function childrenEqual(a: ReactChildren, b: ReactChildren): boolean;
export declare function fastPositionEqual(a: Position, b: Position): boolean;
/**
 * Given two layoutitems, check if they collide.
 */
export declare function collides(l1: LayoutItem, l2: LayoutItem): boolean;
/**
 * Given a layout, compact it. This involves going down each y coordinate and removing gaps
 * between items.
 *
 * Does not modify layout items (clones). Creates a new layout array.
 *
 * @param  {Array} layout Layout.
 * @param  {Boolean} verticalCompact Whether or not to compact the layout
 *   vertically.
 * @param  {Boolean} allowOverlap When `true`, allows overlapping grid items.
 * @return {Array}       Compacted Layout.
 */
export declare function compact(layout: Layout, compactType: CompactType, cols: number, allowOverlap?: boolean): Layout;
/**
 * Compact an item in the layout.
 *
 * Modifies item.
 *
 */
export declare function compactItem(compareWith: Layout, l: LayoutItem, compactType: CompactType, cols: number, fullLayout: Layout, allowOverlap?: boolean): LayoutItem;
/**
 * Given a layout, make sure all elements fit within its bounds.
 *
 * Modifies layout items.
 *
 * @param  {Array} layout Layout array.
 * @param  {Number} bounds Number of columns.
 */
export declare function correctBounds(layout: Layout, bounds: {
    cols: number;
}): Layout;
/**
 * Get a layout item by ID. Used so we can override later on if necessary.
 *
 * @param  {Array}  layout Layout array.
 * @param  {String} id     ID
 * @return {LayoutItem}    Item at ID.
 */
export declare function getLayoutItem(layout: Layout, id: string): LayoutItem | undefined;
/**
 * Returns the first item this layout collides with.
 * It doesn't appear to matter which order we approach this from, although
 * perhaps that is the wrong thing to do.
 *
 * @param  {Object} layoutItem Layout item.
 * @return {Object|undefined}  A colliding layout item, or undefined.
 */
export declare function getFirstCollision(layout: Layout, layoutItem: LayoutItem): LayoutItem | undefined;
export declare function getAllCollisions(layout: Layout, layoutItem: LayoutItem): Array<LayoutItem>;
/**
 * Get all static elements.
 * @param  {Array} layout Array of layout objects.
 * @return {Array}        Array of static layout items..
 */
export declare function getStatics(layout: Layout): Array<LayoutItem>;
/**
 * Move an element. Responsible for doing cascading movements of other elements.
 *
 * Modifies layout items.
 *
 * @param  {Array}      layout            Full layout to modify.
 * @param  {LayoutItem} l                 element to move.
 * @param  {Number}     [x]               X position in grid units.
 * @param  {Number}     [y]               Y position in grid units.
 */
export declare function moveElement(properties: {
    layout: Layout;
    l: LayoutItem;
    x?: number;
    y?: number;
    z?: number;
    isUserAction?: boolean;
    preventCollision?: boolean;
    compactType?: CompactType;
    cols: number;
    allowOverlap?: boolean;
}): Layout;
/**
 * This is where the magic needs to happen - given a collision, move an element away from the collision.
 * We attempt to move it up if there's room, otherwise it goes below.
 *
 * @param  {Array} layout            Full layout to modify.
 * @param  {LayoutItem} collidesWith Layout item we're colliding with.
 * @param  {LayoutItem} itemToMove   Layout item we're moving.
 */
export declare function moveElementAwayFromCollision(properties: {
    layout: Layout;
    collidesWith: LayoutItem;
    itemToMove: LayoutItem;
    isUserAction?: boolean;
    compactType: CompactType;
    cols: number;
}): Layout;
/**
 * Helper to convert a number to a percentage string.
 *
 * @param  {Number} num Any number
 * @return {String}     That number as a percentage.
 */
export declare function perc(num: number): string;
export declare function setTransform({ top, left, z, width, height }: Position): Object;
export declare function setTopLeft({ top, left, z, width, height }: Position): Object;
/**
 * Get layout items sorted from top left to right and down.
 *
 * @return {Array} Array of layout objects.
 * @return {Array}        Layout, sorted static items first.
 */
export declare function sortLayoutItems(layout: Layout, compactType: CompactType): Layout;
/**
 * Sort layout items by row ascending and column ascending.
 *
 * Does not modify Layout.
 */
export declare function sortLayoutItemsByRowCol(layout: Layout): Layout;
/**
 * Sort layout items by column ascending then row ascending.
 *
 * Does not modify Layout.
 */
export declare function sortLayoutItemsByColRow(layout: Layout): Layout;
/**
 * Generate a layout using the initialLayout and children as a template.
 * Missing entries will be added, extraneous ones will be truncated.
 *
 * Does not modify initialLayout.
 *
 * @param  {Array}  initialLayout Layout passed in through props.
 * @param  {String} breakpoint    Current responsive breakpoint.
 * @param  {?String} compact      Compaction option.
 * @return {Array}                Working layout.
 */
export declare function synchronizeLayoutWithChildren(initialLayout: Layout, children: ReactChildren | undefined, cols: number, compactType: CompactType, allowOverlap?: boolean): Layout;
/**
 * Validate a layout. Throws errors.
 *
 * @param  {Array}  layout        Array of layout items.
 * @param  {String} [contextName] Context name for errors.
 * @throw  {Error}                Validation error.
 */
export declare function validateLayout(layout: Layout, contextName?: string): void;
export declare const noop: (args: any) => any;
