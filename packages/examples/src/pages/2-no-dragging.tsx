import React from "react";
import _ from "lodash";
import { GridLayout as RGL, Props, WidthProvider } from "react-grid-layout-next";

const GridLayout = WidthProvider(RGL);

export default class NoDraggingLayout extends React.PureComponent<Partial<Props> & { items: number }, any> {
	static defaultProps = {
		className: "layout",
		isDraggable: false,
		isResizable: false,
		items: 3,
		cols: 12,
		rowHeight: 30,
		onLayoutChange: function () { }
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
			var y = _.result(p, "y") || Math.ceil(Math.random() * 4) + 1;
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