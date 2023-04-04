import * as React from "react";
import { deepEqual } from "fast-equals";

import {
  cloneLayout,
  synchronizeLayoutWithChildren,
  validateLayout,
  noop,
  type Layout
} from "./utils";
import {
  getBreakpointFromWidth,
  getColsFromBreakpoint,
  findOrGenerateResponsiveLayout,
  type ResponsiveLayout,
  type OnLayoutChangeCallback,
  type Breakpoints,
  Breakpoint
} from "./responsiveUtils";
import { GridLayout, Props } from "./GridLayout";

/**
 * Get a value of margin or containerPadding.
 *
 * @param  {Array | Object} param Margin | containerPadding, e.g. [10, 10] | {lg: [10, 10], ...}.
 * @param  {String} breakpoint   Breakpoint: lg, md, sm, xs and etc.
 * @return {Array}
 */
function getIndentationValue<T extends [number, number]>(
  param: Record<string, T> | T | undefined,
  breakpoint: string
): T | undefined {
  if (param == null) return;
  return Array.isArray(param) ? param : param[breakpoint];
}
type StateLayout = {
  layout: Layout;
  layouts?: ResponsiveLayout<string>;
};
type State = {
  breakpoint: string;
  cols: number;
} & StateLayout;

type Modify<T, R> = Omit<T, keyof R> & R;

/* type ResponsiveProps<Breakpoint extends string = string> = Modify<(JSX.LibraryManagedAttributes<typeof GridLayout, React.ComponentProps<typeof GridLayout>>), {

	// Responsive config
	breakpoint?: Breakpoint,
	breakpoints: Breakpoints<Breakpoint>,
	cols: Record<Breakpoint, number>,
	layouts: ResponsiveLayout<Breakpoint>,
	width: number,
	margin: Record<Breakpoint, [number, number]> | [number, number] | undefined,
	containerPadding: Record<Breakpoint, [number, number]> | [number, number] | undefined,

	// Callbacks
	onBreakpointChange: (Breakpoint, cols: number) => void,
	onLayoutChange: OnLayoutChangeCallback,
	onWidthChange: (
		containerWidth: number,
		margin: [number, number],
		cols: number,
		containerPadding?: [number, number]
	) => void

}>
 */

export type ResponsiveProps<Breakpoint extends string = string> = Modify<
  Props,
  {
    // Responsive config
    breakpoint?: Breakpoint;
    breakpoints: Breakpoints<Breakpoint>;
    cols: Record<Breakpoint, number>;
    layouts: ResponsiveLayout<Breakpoint>;
    width: number;
    margin: Record<Breakpoint, [number, number]> | [number, number] | undefined;
    containerPadding:
      | Record<Breakpoint, [number, number]>
      | [number, number]
      | undefined;

    // Callbacks
    onBreakpointChange: (Breakpoint, cols: number) => void;
    onLayoutChange: OnLayoutChangeCallback;
    onWidthChange: (
      containerWidth: number,
      margin: [number, number],
      cols: number,
      containerPadding?: [number, number]
    ) => void;
  }
>;

export const ResponsiveGridLayout = (properties: Partial<ResponsiveProps>) => {
  const {
    breakpoint,
    compactType,
    breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
    cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    containerPadding = {},
    layouts = {},
    margin = [10, 10],
    width = 0,
    onBreakpointChange = noop,
    onLayoutChange = noop,
    onWidthChange = noop
  } = properties;

  const [prevProps, setPrevProps] = React.useState<{
    width: number;
    breakpoints: Breakpoints<Breakpoint>;
    cols: Record<Breakpoint, number>;
  }>({ width, breakpoints, cols });

  const generateInitialState = (): State => {
    const breakpoint = getBreakpointFromWidth(breakpoints, width);
    const colNo = getColsFromBreakpoint(breakpoint, cols);
    const compactType = properties.compactType;
    // Get the initial layout. This can tricky; we try to generate one however possible if one doesn't exist
    // for this layout.
    const initialLayout = findOrGenerateResponsiveLayout(
      layouts,
      breakpoints,
      breakpoint,
      breakpoint,
      colNo,
      compactType
    );

    return {
      layout: initialLayout,
      breakpoint: breakpoint,
      cols: colNo
    };
  };

  const [state, setState] = React.useState<State>(generateInitialState());

  React.useEffect(() => {
    setState(generateInitialState());
  }, [JSON.stringify(layouts)]);
  React.useEffect(() => {
    onWidthChangeFn();
  }, [width, breakpoint, JSON.stringify(breakpoints), JSON.stringify(cols)]);

  // wrap layouts so we do not need to pass layouts to child
  const onLayoutChangeFn: (layout: Layout) => void = (layout: Layout) => {
    onLayoutChange(layout, {
      ...layouts,
      [state.breakpoint]: layout
    });
  };

  // When the width changes work through breakpoints and reset state with the new width & breakpoint.
  // Width changes are necessary to figure out the widget widths.

  const onWidthChangeFn = () => {
    const newBreakpoint =
      breakpoint || getBreakpointFromWidth(breakpoints, width);

    const lastBreakpoint = state.breakpoint;
    const newCols: number = getColsFromBreakpoint(newBreakpoint, cols);
    const newLayouts = { ...layouts };

    // Breakpoint change
    if (
      lastBreakpoint !== newBreakpoint ||
      prevProps.breakpoints !== breakpoints ||
      prevProps.cols !== cols
    ) {
      // Preserve the current layout if the current breakpoint is not present in the next layouts.
      if (!(lastBreakpoint in newLayouts))
        newLayouts[lastBreakpoint] = cloneLayout(state.layout);

      // Find or generate a new layout.
      let layout = findOrGenerateResponsiveLayout(
        newLayouts,
        breakpoints,
        newBreakpoint,
        lastBreakpoint,
        newCols,
        compactType
      );

      // This adds missing items.
      layout = synchronizeLayoutWithChildren(
        layout,
        properties.children,
        newCols,
        compactType,
        properties.allowOverlap
      );

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
    const containerPaddingModified = getIndentationValue(
      containerPadding,
      newBreakpoint
    );

    //call onWidthChange on every change of width, not only on breakpoint changes
    onWidthChange(
      width,
      modifiedMargin!, // TODO fix
      newCols,
      containerPaddingModified
    );
  };

  return (
    <GridLayout
      {...properties}
      // $FlowIgnore should allow nullable here due to DefaultProps
      margin={getIndentationValue(margin, state.breakpoint)}
      containerPadding={getIndentationValue(containerPadding, state.breakpoint)}
      onLayoutChange={onLayoutChangeFn}
      layout={state.layout}
      cols={state.cols}
    />
  );
};
