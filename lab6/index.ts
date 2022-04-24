import { solveGaus } from '../lab1';

/*
	sin(x + 2) - y = 1.5
	x + cos(y - 2) = 0.5

	( sin(x + 2) 	| -y 			)
	( x 			| cos(y - 2) 	)

	( cos(x + 2) 	| -1 			)
	( 1 			| -sin(y - 2) 	)
*/

type F21 = (x: number, y: number) => [number, number];
type F22 = (x: number, y: number) => [[number, number], [number, number]];

const def: {F: F21, dF: F22} = {
	F: (x, y) => [
		Math.sin(x + 2) - y - 1.5,
		x + Math.cos(y - 2) - 0.5,
	],
	dF: (x, y) => [
		[Math.cos(x + 2), -1],
		[1, -Math.sin(y - 2)],
	],
};

const solveNuoton = (
	xs: number, ys: number, { F, dF }: { F: F21, dF: F22 } = def,
): [number, number] => {
	let xn = 0;
	let yn = 0;

	do {
		xn = xs;
		yn = ys;
		const [xy, yy] = solveGaus({ m: dF(xs, ys), d: F(xs, ys).map((e) => -e), n: 2 });
		xs += xy;
		ys += yy;
		i++;
	} while (Math.max(Math.abs(xn - xs), Math.abs(yn - ys)) > 0.01);

	return [xs, ys];
};

const res = solveNuoton(1.3, -1.7);
console.log(res);
console.log(def.F(...res));
