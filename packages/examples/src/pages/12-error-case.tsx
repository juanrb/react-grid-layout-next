import React from "react";
import { GridLayout as RGL, WidthProvider } from "react-grid-layout-next";
import { PropsWithItems } from "./types.js";

const GridLayout = WidthProvider(RGL);

export default class ErrorCaseLayout extends React.PureComponent<PropsWithItems, any> {
	static defaultProps = {
		className: "layout",
		items: 3,
		rowHeight: 100,
		onLayoutChange: function () { },
		cols: 2
	};

	constructor(props) {
		super(props);

		const layout = this.generateLayout();
		this.state = { layout };
	}

	generateDOM() {
		return [
			<div key={"1"}>
				<span className="text">{"1"}</span>
			</div>,
			<div key={"2"}>
				<span className="text">{"2"}</span>
			</div>,
			<div key={"3"}>
				<span className="text">{"3"}</span>
			</div>
		];
	}

	generateLayout() {
		return [
			{
				x: 0,
				y: 0,
				w: 1,
				h: 1,
				i: "1"
			},
			{
				x: 1,
				y: 0,
				w: 1,
				h: 1,
				i: "2"
			},
			{
				x: 0,
				y: 1,
				w: 2,
				h: 2,
				i: "3"
			}
		];
	}

	onLayoutChange(layout) {
		this.props.onLayoutChange?.(layout);
	}

	render() {
		return (
			<GridLayout
				layout={this.state.layout}
				onLayoutChange={this.onLayoutChange}
				{...this.props}
			>
				{this.generateDOM()}
			</GridLayout>
		);
	}
}

