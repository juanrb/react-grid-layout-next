import React from "react";
import _ from "lodash";
import { GridLayout as RGL, WidthProvider } from "react-grid-layout-next";
import { PropsWithItems } from "./types.js";

const GridLayout = WidthProvider(RGL);

const ROW_HEIGHT_MULTIPLIER = 2;
export default class RelativeRowHeight extends React.PureComponent<PropsWithItems, any> {
	static defaultProps = {
		className: "layout",
		items: 2,
		cols: 4,
		rowHeight: (width: number) => width * ROW_HEIGHT_MULTIPLIER
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
		return _.map(new Array(this.props.items), function (item, i) {
			return {
				x: i,
				y: 0,
				w: 1,
				h: (i + 1),
				i: i.toString()
			};
		});
	}


	render() {
		return (
			<div >
				<p>Row height is  height * {ROW_HEIGHT_MULTIPLIER} * column width. This property is useful when you want the same relative position of elements on different screen sizes</p>
				<GridLayout
					{...this.props}
					layout={this.state.layout}
					useCSSTransforms={true}
					onLayoutChange={(e) => { console.log(e) }}
				>
					{this.generateDOM()}
				</GridLayout>
			</div >
		);
	}
}
