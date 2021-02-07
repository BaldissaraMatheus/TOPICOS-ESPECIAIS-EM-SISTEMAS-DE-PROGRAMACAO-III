export class Point {
	constructor(x, y, size, color) {
		this._x = x;
		this._y = y;
		this._size = size;
		this._color = color;
	}

	get x() {
		return this._x;
	}

	get y() {
		return this._y;
	}

	set x(_x) {
		this._x = x;
	}

	set y(_y) {
		this._y = y;
	}

	get size() {
		return this._size;
	}

	set size(_s) {
		this._size = s;
	}

	get color() {
		return this._color;
	}

	set color(color) {
		this._color = color;
	}

	isInside(x, y) {
		const size = Math.round(this.size / 2.0);
		return y >= this.y - size
			&& y <= this.y + size
			&& x >= this.x - size
			&& x <= this.x + size
	}
}
