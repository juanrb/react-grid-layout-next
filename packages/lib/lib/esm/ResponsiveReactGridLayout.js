import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cloneLayout, synchronizeLayoutWithChildren, noop } from "./utils";
import { getBreakpointFromWidth, getColsFromBreakpoint, findOrGenerateResponsiveLayout } from "./responsiveUtils";
import ReactGridLayout from "./ReactGridLayout";
/**
 * Get a value of margin or containerPadding.
 *
 * @param  {Array | Object} param Margin | containerPadding, e.g. [10, 10] | {lg: [10, 10], ...}.
 * @param  {String} breakpoint   Breakpoint: lg, md, sm, xs and etc.
 * @return {Array}
 */
function getIndentationValue(param, breakpoint) {
    if (param == null)
        return;
    return Array.isArray(param) ? param : param[breakpoint];
}
export const ResponsiveReactGridLayout = (properties) => {
    const { breakpoint, compactType, breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }, cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }, containerPadding = {}, layouts = {}, margin = [10, 10], width = 0, onBreakpointChange = noop, onLayoutChange = noop, onWidthChange = noop } = properties;
    const [prevProps, setPrevProps] = React.useState({ width, breakpoints, cols });
    const generateInitialState = () => {
        const breakpoint = getBreakpointFromWidth(breakpoints, width);
        const colNo = getColsFromBreakpoint(breakpoint, cols);
        const compactType = properties.compactType;
        // Get the initial layout. This can tricky; we try to generate one however possible if one doesn't exist
        // for this layout.
        const initialLayout = findOrGenerateResponsiveLayout(layouts, breakpoints, breakpoint, breakpoint, colNo, compactType);
        return {
            layout: initialLayout,
            breakpoint: breakpoint,
            cols: colNo
        };
    };
    const [state, setState] = React.useState(generateInitialState());
    React.useEffect(() => {
        setState(generateInitialState());
    }, [JSON.stringify(layouts)]);
    React.useEffect(() => {
        onWidthChangeFn();
    }, [width, breakpoint, JSON.stringify(breakpoints), JSON.stringify(cols)]);
    // wrap layouts so we do not need to pass layouts to child
    const onLayoutChangeFn = (layout) => {
        onLayoutChange(layout, {
            ...layouts,
            [state.breakpoint]: layout
        });
    };
    // When the width changes work through breakpoints and reset state with the new width & breakpoint.
    // Width changes are necessary to figure out the widget widths.
    const onWidthChangeFn = () => {
        const newBreakpoint = breakpoint || getBreakpointFromWidth(breakpoints, width);
        const lastBreakpoint = state.breakpoint;
        const newCols = getColsFromBreakpoint(newBreakpoint, cols);
        const newLayouts = { ...layouts };
        // Breakpoint change
        if (lastBreakpoint !== newBreakpoint ||
            prevProps.breakpoints !== breakpoints ||
            prevProps.cols !== cols) {
            // Preserve the current layout if the current breakpoint is not present in the next layouts.
            if (!(lastBreakpoint in newLayouts))
                newLayouts[lastBreakpoint] = cloneLayout(state.layout);
            // Find or generate a new layout.
            let layout = findOrGenerateResponsiveLayout(newLayouts, breakpoints, newBreakpoint, lastBreakpoint, newCols, compactType);
            // This adds missing items.
            layout = synchronizeLayoutWithChildren(layout, properties.children, newCols, compactType, properties.allowOverlap);
            // Store the new layout.
            newLayouts[newBreakpoint] = layout;
            // callbacks
            onLayoutChange(layout, newLayouts);
            onBreakpointChange(newBreakpoint, newCols);
            setState({
                breakpoint: newBreakpoint,
                layout: layout,
                cols: newCols
            });
        }
        setPrevProps({ breakpoints, cols, width });
        let modifiedMargin = getIndentationValue(margin, newBreakpoint);
        const containerPaddingModified = getIndentationValue(containerPadding, newBreakpoint);
        //call onWidthChange on every change of width, not only on breakpoint changes
        onWidthChange(width, modifiedMargin, // TODO fix
        newCols, containerPaddingModified);
    };
    return (_jsx(ReactGridLayout, { ...properties, 
        // $FlowIgnore should allow nullable here due to DefaultProps
        margin: getIndentationValue(margin, state.breakpoint), containerPadding: getIndentationValue(containerPadding, state.breakpoint), onLayoutChange: onLayoutChangeFn, layout: state.layout, cols: state.cols }));
};
//# sourceMappingURL=ResponsiveReactGridLayout.js.map