import React, { Component } from "react";
import PropTypes from "prop-types";

import GenericChartComponent from "../../GenericChartComponent";
import { getMouseCanvas } from "../../GenericComponent";

import { isHovering2 } from "./StraightLine";
import { hexToRGBA } from "../../utils";

class ClickableShape extends Component {
	constructor(props) {
		super(props);
		this.saveNode = this.saveNode.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
		this.isHover = this.isHover.bind(this);
	}
	saveNode(node) {
		this.node = node;
	}
	isHover(moreProps) {
		const { mouseXY } = moreProps;
		if (this.closeIcon) {
			const { textBox } = this.props;
			const { x, y } = this.closeIcon;
			const halfWidth = textBox.closeIcon.width / 2;

			const start1 = [x - halfWidth, y - halfWidth];
			const end1 = [x + halfWidth, y + halfWidth];
			const start2 = [x - halfWidth, y + halfWidth];
			const end2 = [x + halfWidth, y - halfWidth];

			if (isHovering2(start1, end1, mouseXY, 3) || isHovering2(start2, end2, mouseXY, 3)) {
				return true;
			}
		}
		return false;
	}
	drawOnCanvas(ctx, moreProps) {
		const { stroke, strokeWidth, strokeOpacity, hoveringCloseIcon, textBox, selected, hovering } = this.props;

		const [x, y, rectX, rectY] = helper(this.props, moreProps, ctx);

		this.closeIcon = { x, y };
		ctx.beginPath();
		ctx.strokeStyle = hexToRGBA(stroke, strokeOpacity);
		if (selected || hovering) {
			ctx.lineWidth = strokeWidth + 1;
		} else {
			ctx.lineWidth = strokeWidth;
		}

		ctx.fillStyle = hexToRGBA(textBox.closeIcon.fill, strokeOpacity);
		ctx.fillRect(rectX, rectY, textBox.closeIcon.width * 2 + 2, textBox.height);
		ctx.strokeRect(rectX, rectY, textBox.closeIcon.width * 2 + 2, textBox.height);
		const halfWidth = textBox.closeIcon.width / 2;
		ctx.moveTo(x - halfWidth, y - halfWidth);
		ctx.lineTo(x + halfWidth, y + halfWidth);
		ctx.moveTo(x - halfWidth, y + halfWidth);
		ctx.lineTo(x + halfWidth, y - halfWidth);
		ctx.lineWidth = hoveringCloseIcon ? strokeWidth + 1 : strokeWidth;
		ctx.stroke();
	}
	renderSVG() {
		throw new Error("svg not implemented");
	}
	render() {
		const { interactiveCursorClass } = this.props;
		const { show } = this.props;
		const { onHover, onUnHover, onClick } = this.props;

		return show
			? <GenericChartComponent ref={this.saveNode}
				interactiveCursorClass={interactiveCursorClass}
				isHover={this.isHover}

				onClickWhenHover={onClick}

				svgDraw={this.renderSVG}

				canvasDraw={this.drawOnCanvas}
				canvasToDraw={getMouseCanvas}

				onHover={onHover}
				onUnHover={onUnHover}

				drawOn={["pan", "mousemove", "drag"]}
			/>
			: null;
	}
}

function helper(props, moreProps, ctx) {
	const { yValue, text, textBox } = props;
	const { fontFamily, fontStyle, fontWeight, fontSize } = props;
	ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;

	const { chartConfig: { yScale } } = moreProps;

	const x = textBox.left
		+ textBox.padding.left
		+ ctx.measureText(text).width
		+ textBox.padding.right
		+ textBox.closeIcon.padding.left
		+ textBox.closeIcon.width / 2;
	const rectX = x - textBox.closeIcon.width - 1;

	const y = Math.round(yScale(yValue));
	const rectY = y - textBox.height / 2;

	return [x, y, rectX, rectY];

}

ClickableShape.propTypes = {
	stroke: PropTypes.string.isRequired,
	strokeOpacity: PropTypes.number.isRequired,
	strokeWidth: PropTypes.number.isRequired,
	textBox: PropTypes.object.isRequired,
	hoveringCloseIcon: PropTypes.bool,
	selected: PropTypes.bool.isRequired,
	hovering: PropTypes.bool.isRequired,
	interactiveCursorClass: PropTypes.string,
	show: PropTypes.bool,
	onHover: PropTypes.func,
	onUnHover: PropTypes.func,
	onClick: PropTypes.func,
};


ClickableShape.defaultProps = {
	show: false,
	fillOpacity: 1,
	strokeOpacity: 1,
	strokeWidth: 1,
	fill: "#FFFFFF",

	selected: false,
	hovering: false,
};

export default ClickableShape;
