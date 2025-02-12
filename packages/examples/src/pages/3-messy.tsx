
import * as React from "react";
import _ from "lodash";
import { GridLayout as RGL, Layout, Props, WidthProvider } from "react-grid-layout-next";
import { PropsWithItems } from "./types.js";

const GridLayout = WidthProvider(RGL);


type State = {
	layout: Layout
};


export default class MessyLayout extends React.PureComponent<PropsWithItems, State> {
	static defaultProps: PropsWithItems = {
		className: "layout",
		cols: 12,
		items: 20,
		onLayoutChange: function () { },
		rowHeight: 30,
	};

	state: State = {
		layout: this.generateLayout()
	};

	generateDOM() {
		return _.map(_.range(this.props.items), function (i) {
			return (
				<div key={i}>
					<span className="text">{i}</span>
				</div>
			);
		});
	}

	generateLayout(): Layout {
		const p = this.props;
		return _.map(new Array(p.items), function (item, i) {
			const w = Math.ceil(Math.random() * 4);
			const y = Math.ceil(Math.random() * 4) + 1;
			return {
				x: (i * 2) % 12,
				y: Math.floor(i / 6) * y,
				w: w,
				h: y,
				i: i.toString()
			};
		});
	}

	onLayoutChange: (Layout) => void = (layout: Layout) => {
		this.props.onLayoutChange?.(layout);
	};

	render(): React.ReactNode {
		// eslint-disable-next-line no-unused-vars
		const { items, ...props } = this.props;
		return (
			<GridLayout
				{...props}
				layout={this.state.layout}
				onLayoutChange={this.onLayoutChange}
			>
				{this.generateDOM()}
			</GridLayout>
		);
	}
}