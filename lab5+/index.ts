/*

	v.10
	p		= 0
	q		= 1
	f(x)	= 4 e^x
	y0		= 4
	y'0		= -3

	y'' + p y' + q y - f(x) = 0
	y'' = -p y' - q y + f(x)

	y' 	= f1(x,y,y1) = y1
	y1'	= f2(x,y,y1) = -p y1 - q y + f(x)

	y' 	= f1(x,y,y1) = y1
	y1'	= f2(x,y,y1) = -y + 4 e^x

	x0 					= 1
	Y(x0) 	= (y0, y'0)	= (4, -3)
	X 		= x0 		= 1

*/

const P = 0;
const Q = 1;
const F = (x: number) => 4 * Math.exp(x);
const y0 = 4;
const yy0 = -3;

const solve = ({
	p = P, q = Q, f = F, Xs = 0, Xe = 1, Ys = [y0, yy0], n = 2 ** 7,
} = {}) => {
	let Y = [...Ys];
	let X = Xs;
	const h = (Xe - Xs) / n;
	const ff = ([x, y, y1]: number[]) => [y1, -p * y1 - q * y + f(x)];
	for (let iii = 0; iii < n; iii++) {
		const k1 = ff([X, ...Y]);
		const k2 = ff([X + h / 2, ...Y.map((y, i) => y + h * k1[i] / 2)]);
		const k3 = ff([X + h / 2, ...Y.map((y, i) => y + h * k2[i] / 2)]);
		const k4 = ff([X + h / 2, ...Y.map((y, i) => y + h * k3[i])]);
		X += h;
		Y = Y.map((y, i) => y + h / 6 * (k1[i] + 2 * (k2[i] + k3[i]) + k4[i]));
	}
	return Y;
};

const s = solve();
console.log(s);
const orig = [2.309813344614887, 1.0521101579615983];
// console.log(s.map((a, i) => (a - orig[i]).toExponential(5)));
