import { PointList } from '../classroom/classes/PointList';

//Converts hexadecimal code to rgb color tuple
function hexToRgb(hex) {
	var bigint = parseInt(hex, 16);
	var r = (bigint >> 16) & 255;
	var g = (bigint >> 8) & 255;
	var b = bigint & 255;

	return [r, g, b];
}

mouseMove = function (event) {
	var offsetLeft = canvas.offsetLeft;
	var offsetTop = canvas.offsetTop;
	var color = "white";
	var x = event.pageX - offsetLeft,
		y = event.pageY - offsetTop;

	for (let i = 0; i < pointList.size; i++) {
		if (pointList.list[i].isInside(x, y)) {
			color = `rgb(${pointList.list[i].color.r},${pointList.list[i].color.g},${pointList.list[i].color.b})`;
			break;
		}
	}
	// event.pageX is the x coordinate of the cursor
	// event.pageY is the y coordinate of the cursor
	var x = event.pageX - offsetLeft,
		y = event.pageY - offsetTop;

	info.position = "Position: (" + x.toString() + "," + y.toString() + ")";
	info.color = color;

	//cursor_pos.innerHTML = 'Position: (' + x.toString() + ',' + y.toString() + ')';
	//color_box.style.backgroundColor = color;
};

mouseClick = function (event) {
	var offsetLeft = canvas.offsetLeft;
	var offsetTop = canvas.offsetTop;

	// event.pageX is the x coordinate of the cursor
	// event.pageY is the y coordinate of the cursor
	var x = event.pageX - offsetLeft,
		y = event.pageY - offsetTop;

	/*var x = event.pageX,
			y = event.pageY;*/

	// Collision detection between clicked offset and element.
	var i;
	for (i = 0; i < pointList.size; i++) {
		if (pointList.list[i].isInside(x, y)) {
			size = point.size;
			var message =
				"clicked a point of size " +
				size.toString() +
				" in position:(" +
				x.toString() +
				"," +
				y.toString() +
				")";
			alert(message);
			break;
		}
	}
};

mouseClickCreatePoint = function (event) {
	var offsetLeft = canvas.offsetLeft;
	var offsetTop = canvas.offsetTop;

	// event.pageX is the x coordinate of the cursor
	// event.pageY is the y coordinate of the cursor
	var x = event.pageX - offsetLeft,
		y = event.pageY - offsetTop;

	//var rgb = hexToRgb(properties.foregroundColor);
	var r = properties.foregroundColor[0];
	var g = properties.foregroundColor[1];
	var b = properties.foregroundColor[2];
	var color = new Color(r, g, b, 255);

	point = new Point(x, y, properties.pointSize, color);
	pointList.push(point);
	render(canvas, pointList, lineSegmentList);
};

mouseClickCreateLineSegment = function (event) {
	var offsetLeft = canvas.offsetLeft;
	var offsetTop = canvas.offsetTop;

	// event.pageX is the x coordinate of the cursor
	// event.pageY is the y coordinate of the cursor
	var x = event.pageX - offsetLeft,
		y = event.pageY - offsetTop;

	//var rgb = hexToRgb(properties.foregroundColor);
	var r = properties.foregroundColor[0];
	var g = properties.foregroundColor[1];
	var b = properties.foregroundColor[2];
	var color = new Color(r, g, b, 255);

	lineSegment = new LineSegment(x, y, x, y, color);
	lineSegmentList.push(lineSegment);
	canvas.removeEventListener("click", interaction.currentEventListener);
	interaction.currentEventListener = mouseClickCloseLineSegment;
	canvas.addEventListener(
		"click",
		interaction.currentEventListener,
		false
	);
};

mouseClickCloseLineSegment = function (event) {
	var offsetLeft = canvas.offsetLeft;
	var offsetTop = canvas.offsetTop;

	// event.pageX is the x coordinate of the cursor
	// event.pageY is the y coordinate of the cursor
	var x = event.pageX - offsetLeft,
		y = event.pageY - offsetTop;

	index = lineSegmentList.list.length;
	lineSegment = lineSegmentList.list[index - 1];
	lineSegment.x1 = x;
	lineSegment.y1 = y;
	canvas.removeEventListener("click", interaction.currentEventListener);
	interaction.currentEventListener = mouseClickCreateLineSegment;
	canvas.addEventListener(
		"click",
		interaction.currentEventListener,
		false
	);
	render(canvas, pointList, lineSegmentList);
};

function render(canvas, pointList, lineSegmentList) {
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	pointList.drawPoints(ctx);
	lineSegmentList.drawLineSegments(ctx);
}

function init() {
	var canvas = document.getElementById("canvas");
	var cursor_pos = document.getElementById("cursor_pos");
	var color_box = document.getElementById("color_box");

	canvas.addEventListener("mousemove", mouseMove, false);

	// Add event listener for `click` events.
	canvas.addEventListener(
		"click",
		interaction.currentEventListener,
		false
	);

	var gui = new dat.GUI();
	var infoFolder = gui.addFolder("Info");

	infoFolder.addColor(info, "color").listen();
	infoFolder.add(info, "position").listen();

	var toolsFolder = gui.addFolder("Tools");
	toolsFolder.add(tools, "draw");
	toolsFolder.add(tools, "pick");

	var propertiesFolder = gui.addFolder("Properties");
	propertiesFolder.addColor(properties, "foregroundColor");
	propertiesFolder.add(properties, "pointSize", 1, 20);
	propertiesFolder.add(properties, "lineWidth", 1, 5);
	primitiveController = propertiesFolder.add(
		properties,
		"primitiveType",
		["point", "line", "circle", "polygon"]
	);

	primitiveController.onChange(function (value) {
		if (value == "point") {
			primitiveType = PrimitiveType.POINT;
		} else if (value == "line") {
			primitiveType = PrimitiveType.LINE;
		} else if (value == "circle") {
			primitiveType = PrimitiveType.CIRCLE;
		} else {
			primitiveType = PrimitiveType.POLYGON;
		}

		canvas.removeEventListener("click", interaction.currentEventListener);

		switch (primitiveType) {
			case PrimitiveType.POINT:
				interaction.currentEventListener = mouseClickCreatePoint;
				break;
			case PrimitiveType.LINE:
				interaction.currentEventListener = mouseClickCreateLineSegment;
				break;
		}
		canvas.addEventListener(
			"click",
			interaction.currentEventListener,
			false
		);
	});

	infoFolder.open();
	propertiesFolder.open();
	toolsFolder.open();

	render(canvas, pointList, lineSegmentList);
}

const InteractionMode = { NONE: 1, DRAW: 2, PICK: 3 };
const PrimitiveType = { POINT: 1, CIRCLE: 2, LINE: 3, POLYGON: 4 };

var interaction = {
	mode: InteractionMode.NONE,
	currentEventListener: mouseClickCreatePoint,
};
var primitiveType = PrimitiveType.LINE;

Info = function () {
	this.color = [255, 255, 255];
	this.position = "Position (0,0)";
};

Tools = function () {
	this.draw = function () {
		interaction.mode = InteractionMode.DRAW;
		var canvas = document.getElementById("canvas");
		canvas.removeEventListener("click", interaction.currentEventListener);

		switch (primitiveType) {
			case PrimitiveType.POINT:
				interaction.currentEventListener = mouseClickCreatePoint;
				break;
			case PrimitiveType.LINE:
				interaction.currentEventListener = mouseClickCreateLineSegment;
				break;
		}
		canvas.addEventListener(
			"click",
			interaction.currentEventListener,
			false
		);
	};

	this.pick = function () {
		interaction.mode = InteractionMode.PICK;
		var canvas = document.getElementById("canvas");
		canvas.removeEventListener("click", interaction.currentEventListener);
		interaction.currentEventListener = mouseClick;
		canvas.addEventListener(
			"click",
			interaction.currentEventListener,
			false
		);
	};
};

Properties = function () {
	this.foregroundColor = [0, 0, 0];
	this.pointSize = 8;
	this.lineWidth = 2;
	this.primitiveType = "point";
};

var pointList = new PointList();
var lineSegmentList = new LineSegmentList();
var info = new Info();
var tools = new Tools();
var properties = new Properties();
lineSegment = new LineSegment(0, 0, 10, 10, new Color(0, 0, 0));
lineSegment.x0 = 300;
lineSegmentList.push(lineSegment);

window.onload = function () {};

window.onload = init();
