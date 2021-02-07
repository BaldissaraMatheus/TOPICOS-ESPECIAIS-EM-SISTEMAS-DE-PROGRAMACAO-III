export class Color {
	constructor(r, g, b, a) {
		this._red = r;
		this._green = g;
		this._blue = b;
		this._alpha = a;
	}

	get red() {
		return this._red;
	}

	set red(r) {
		this._red = r;
	}

	get green() {
		return this._green;
	}

	set green(g) {
		this._green = g;
	}

	get blue() {
		return this._blue;
	}
	set blue(b) {
		this._blue = b;
	}

	get alpha() {
		return this._alpha;
	}
	set alpha(a) {
		this._alpha = a;
	}
}