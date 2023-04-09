import React, { RefObject } from "react";
import _ from "lodash";
import { GridLayout as RGL, Props, WidthProvider } from "react-grid-layout-next";
import './ResizableHandles.css'

const GridLayout = WidthProvider(RGL);

const availableHandles = ["s", "w", "e", "n", "sw", "nw", "se", "ne"];


const items = 20;

class MyHandleComponent extends React.Component<any, any> {
	render() {
		const { handleAxis, innerRef, ...props } = this.props;
		return <div ref={innerRef} className={`foo handle-${handleAxis}`} {...props} />
	}
}
const MyHandle = React.forwardRef((props, ref) => <MyHandleComponent innerRef={ref} {...props} />);

export default class ResizableHandles extends React.PureComponent<Partial<Props>, any> {

	constructor(props) {
		super(props);
		this.state = {};
	}

	generateDOM() {
		return _.map(_.range(items), function (i) {
			return (
				<div key={i}>
					<span className="text">{i}</span>
				</div>
			);
		});
	}

	render() {
		return (
			<GridLayout
				layout={_.map(new Array(items), (item, i) => {
					const y = _.result(this.props, "y") || Math.ceil(Math.random() * 4) + 1;
					return {
						x: (i * 2) % 12,
						y: Math.floor(i / 6) * y,
						w: 2,
						h: y,
						i: i.toString(),
						resizeHandles: _.shuffle(availableHandles).slice(0, _.random(1, availableHandles.length - 1))
					};
				})}
				className={"layout"}
				rowHeight={30}
				cols={12}
				onResizeStart={(p) => { console.log(p.item) }}
				draggableCancel=".custom-react-resizable-handle" // We need to cancel drag events, when we drag the resize handle, passing the class solves this
				resizeHandle={(axis, ref) => <div ref={ref as RefObject<HTMLDivElement>} className={`custom-react-resizable-handle custom-react-resizable-handle custom-react-resizable-handle-${axis}`}></div>}
			>
				{this.generateDOM()}
			</GridLayout>
		);
	}
}
