import { useRef, useState } from "react";
import _ from "lodash";
import { ResponsiveGridLayout as RGL, Layout, WidthProvider, ResponsiveProps } from "react-grid-layout-next";
import { Breakpoint } from "react-grid-layout-next";
import { Breakpoints } from "react-grid-layout-next";

const ResponsiveGridLayout = WidthProvider(RGL);

let breakpoints: Breakpoints<string> = {
	'md': 800,
	'xxs': 0

}
const generateLayout = (items: number): Record<Breakpoint, Layout> => {
	let layouts = {
		md: _.map(new Array(items), (_item, i) => {
			const y = Math.ceil(Math.random() * 4) + 1;
			return {
				x: (i * 2) % 12,
				y: Math.floor(i / 6) * y,
				w: 2,
				h: (i + 1),
				i: i.toString()
			}
		})
	}
	return layouts
}

export const ResponseLayoutNewBreakPoint = () => {
	const [items, setItems] = useState(2)
	const [layouts, setLayouts] = useState(generateLayout(items))
	const breakpoint = useRef<Breakpoint>()

	const generateDOM = () => {
		return _.map(_.range(items), function (i) {
			return (
				<div key={i}>
					<span className="text">{i}</span>
				</div>
			);
		});
	}


	return (
		<div>
			<p>Layouts are shared between breakpoints if missing. For example, you set up the layout in 'md' but you resize the window to 'sm' then the 'sm' layout will be generated as good as possible from 'md' on resize</p>
			<button onClick={() => {
				setItems(items + 1);
				if (!breakpoint.current) {
					throw new Error("Missing current breakpoint")
				}
				layouts[breakpoint.current].push({ h: 1, i: String(layouts[breakpoint.current].length), w: 1, x: 0, y: 0 })
				setLayouts(layouts)

			}}>Add item</button>
			<ResponsiveGridLayout
				cols={{ md: 10, xxs: 2 }}
				rowHeight={(width: number) => width}
				layouts={layouts}
				onLayoutChange={({ layouts }) => {
					setLayouts(layouts)
				}}
				breakpoints={breakpoints}
				useCSSTransforms={true}
				onBreakpointChange={(b) => {
					breakpoint.current = b;
				}}
				allowOverlap={true}
			>
				{generateDOM()}
			</ResponsiveGridLayout>
		</div >
	);
}
