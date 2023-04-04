import React from "react";
import { ResponsiveProps, WidthProvider, ResponsiveGridLayout as RGL } from "react-grid-layout-next";

const ResponsiveGridLayout = WidthProvider(RGL);

/**
 * This example illustrates how to let grid items lay themselves out with a bootstrap-style specification.
 */
export default class BootstrapStyleLayout extends React.PureComponent<ResponsiveProps & { items: number }, any> {
	static defaultProps = {
		isDraggable: true,
		isResizable: true,
		items: 20,
		rowHeight: 30,
		onLayoutChange: function () { },
		cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }
	};

	render() {
		return (
			<ResponsiveGridLayout
				{...this.props}
				onLayoutChange={this.props.onLayoutChange}
			>
				<div
					data-grid={{
						w: { lg: 6, md: 5, sm: 3, xs: 4, xxs: 2 },
						h: { lg: 4, xxs: 3 }
					}}
				>
					0
				</div>
			</ResponsiveGridLayout>
		);
	}
}
