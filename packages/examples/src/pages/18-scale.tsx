import React from "react";
import _ from "lodash";
import { GridLayout as RGL, WidthProvider } from "react-grid-layout-next";
import { PropsWithItems } from "./types.js";

const GridLayout = WidthProvider(RGL);

export default class ScaledLayout extends React.PureComponent<PropsWithItems, any> {
	static defaultProps = {
		className: "layout",
		items: 20,
		rowHeight: 30,
		onLayoutChange: function () { },
		cols: 12,
		transformScale: 0.5
	};

	constructor(props) {
		super(props);

		const layout = this.generateLayout();
		this.state = { layout };
	}

	generateDOM() {
		return _.map(_.range(this.props.items), function (i) {
			return (
				<div key={i}>
					<span className="text">{i}</span>
				</div>
			);
		});
	}

	generateLayout() {
		const p = this.props;
		return _.map(new Array(p.items), function (item, i) {
			const y = _.result(p, "y") || Math.ceil(Math.random() * 4) + 1;
			return {
				x: (i * 2) % 12,
				y: Math.floor(i / 6) * y,
				w: 2,
				h: y,
				i: i.toString()
			};
		});
	}

	onLayoutChange(layout) {
		this.props.onLayoutChange?.(layout);
	}

	render() {
		return (
			<div style={{ transform: 'scale(0.5) translate(-50%, -50%)' }}>
				<GridLayout
					layout={this.state.layout}
					onLayoutChange={this.onLayoutChange}
					{...this.props}
				>
					{this.generateDOM()}
				</GridLayout>
			</div>
		);
	}
}