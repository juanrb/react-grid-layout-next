import React from "react";
import _ from "lodash";
import { GridLayout as RGL, WidthProvider } from "react-grid-layout-next";
import { PropsWithItems } from "./types.js";

const GridLayout = WidthProvider(RGL);

const ROW_HEIGHT_MULTIPLIER = 2;
export default class RelativeRowHeight extends React.PureComponent<PropsWithItems, any> {
	static defaultProps = {
		className: "layout",
		items: 3,
		rowHeight: (width: number) => width * ROW_HEIGHT_MULTIPLIER,
		onLayoutChange: function () { },
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
		return _.map(new Array(), function (item, i) {
			const y = _.result(p, "y") || Math.ceil(Math.random() * 4) + 1;
			return {
				x: (i * 2) % 12,
				y: Math.floor(i / 6) * y,
				w: 2,
				h: (i + 1),
				i: i.toString()
			};
		});
	}

	onLayoutChange(layout) {
		this.props.onLayoutChange?.(layout);
	}

	render() {
		return (
			<div >
				<p>Row height is  height * {ROW_HEIGHT_MULTIPLIER} * column width. This property is useful when you want the same relative position of elements on different screen sizes</p>
				<GridLayout
					{...this.props}
					layout={this.state.layout}
					onLayoutChange={this.onLayoutChange.bind(this)}
					useCSSTransforms={true}
				>
					{this.generateDOM()}
				</GridLayout>
			</div >
		);
	}
}
