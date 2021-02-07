import { Color } from './Color';
import { Point } from './Point';

export class PointList {
	constructor() {
		this._list = [];
	}

	get size() {
		return this._list.length;
	}

	get list() {
		return this._list;
	}

	addPoint(point) {
		this._list.push(point);
	}

	randomFill(n) {
		const width = canvas.width;
		const height = canvas.height;
		const getRandomValueFromColorRange = () => Math.floor(Math.random() * 255);

		for (let i = 0; i < n; i++) {
			const x = Math.floor(Math.random() * width);
			const y = Math.floor(Math.random() * height);

			const r = getRandomValueFromColorRange();
			const g = getRandomValueFromColorRange();
			const b = getRandomValueFromColorRange();
			const color = new Color(r, g, b, 1);
			const point = new Point(x, y, 8, color);

			this.addPoint(point);
		}
	}
}