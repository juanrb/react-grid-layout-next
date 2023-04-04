
import * as React from "react";
import _ from "lodash";
import { Breakpoint, OnLayoutChangeCallback, WidthProvider, CompactType, ResponsiveGridLayout as RGL, ResponsiveProps, Layout, LayoutItem, ReactChildren } from "react-grid-layout-next";

const ResponsiveGridLayout = WidthProvider(RGL);

type State = {
	currentBreakpoint: string,
	compactType?: CompactType,
	mounted: boolean,
	layouts: Record<string, Layout>
};

export default class ShowcaseLayout extends React.Component<Partial<ResponsiveProps>, State> {
	static defaultProps: Partial<ResponsiveProps> = {
		className: "layout",
		rowHeight: 30,
		onLayoutChange: function () { },
		cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
	};

	state: State = {
		currentBreakpoint: "lg",
		compactType: "vertical",
		mounted: false,
		layouts: { lg: generateLayout() }
	};

	componentDidMount() {
		this.setState({ mounted: true });
	}

	generateDOM(): ReactChildren {
		return _.map(this.state.layouts.lg, function (l, i) {

			/* return (
				<div key={Math.round(Math.random() * 1000)}>{l.static ? 'STATIC' : ' O '}</div>

			); */
			return <div key={i} className={l.static ? "static" : ""}>
				{l.static ? (
					<span
						className="text"
						title="This item is static and cannot be removed or resized."
					>
						Static - {i}
					</span>
				) : (
					<span className="text">{i}</span>
				)}
			</div>
		});
	}

	onBreakpointChange: (breakpoint: Breakpoint) => void = (breakpoint) => {
		this.setState({
			currentBreakpoint: breakpoint
		});
	};

	onCompactTypeChange: () => void = () => {
		const { compactType: oldCompactType } = this.state;
		const compactType =
			oldCompactType === "horizontal"
				? "vertical"
				: oldCompactType === "vertical"
					? undefined
					: "horizontal";
		this.setState({ compactType });
	};

	onLayoutChange: OnLayoutChangeCallback = (properties) => {
		this.props.onLayoutChange?.(properties);
	};

	onNewLayout: React.MouseEventHandler<HTMLButtonElement> = () => {
		this.setState({
			layouts: { lg: generateLayout() }
		});
	};

	onDrop: (layout: Layout, item?: LayoutItem) => void = (elemParams) => {
		alert(`Element parameters: ${JSON.stringify(elemParams)}`);
	};

	render(): React.ReactNode {
		// eslint-disable-next-line no-unused-vars
		return (
			<div>
				<div>
					Current Breakpoint: {this.state.currentBreakpoint} (
					{this.props.cols?.[this.state.currentBreakpoint]} columns)
				</div>
				<div>
					Compaction type:{" "}
					{_.capitalize(this.state.compactType) || "No Compaction"}
				</div>
				<button onClick={this.onNewLayout}>Generate New Layout</button>
				<button onClick={this.onCompactTypeChange}>
					Change Compaction Type
				</button>
				<ResponsiveGridLayout
					{...this.props}
					layouts={this.state.layouts}
					onBreakpointChange={this.onBreakpointChange}
					onLayoutChange={this.onLayoutChange}
					onDrop={this.onDrop}
					// WidthProvider option
					measureBeforeMount={false}
					// I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
					// and set `measureBeforeMount={true}`.
					useCSSTransforms={this.state.mounted}
					compactType={this.state.compactType}
					preventCollision={!this.state.compactType}
				>
					{this.generateDOM()}
				</ResponsiveGridLayout>
			</div>
		);
	}
}

function generateLayout() {
	return _.map(_.range(0, 20), function (item, i) {
		var y = Math.ceil(Math.random() * 4) + 1;
		return {
			x: Math.round(Math.random() * 5) * 2,
			y: Math.floor(i / 6) * y,
			w: 2,
			h: y,
			i: i.toString(),
			static: Math.random() < 0.3
		};
	});
}