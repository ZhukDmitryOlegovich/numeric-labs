import style from 'chalk';

export const N = 16;
export const F = Math.exp;
export const A = 0;
export const B = 1;

type Input = {
	a?: number;
	b?: number;
	n?: number;
	f?: (_: number) => number;
	startSum?: number;
};

const buildMetod = ({ n, f, startSum }: Required<Input>) => Array
	.from({ length: n }, (_, i) => f(i))
	.reduce((sum, x) => sum + x, startSum) / n;

const metodRectangles = ({
	a = A, b = B, n = N, f = F,
}: Input = {}) => buildMetod({
	a, b, n, f: (i) => f(a + (b - a) * (2 * i + 1) / (2 * n)), startSum: 0,
});

const metodTrapezoids = ({
	a = A, b = B, n = N, f = F,
}: Input = {}) => buildMetod({
	a, b, n, f: (i) => f(a + (b - a) * i / n) + f(a + (b - a) * (i + 1) / n), startSum: 0,
}) / 2;

const metodSimpson1 = ({
	a = A, b = B, n = N, f = F,
}: Input = {}) => buildMetod({
	a,
	b,
	n,
	f: (i) => f(a + (b - a) * i / n)
		+ 4 * f(a + (b - a) * (2 * i + 1) / (2 * n))
		+ f(a + (b - a) * (i + 1) / n),
	startSum: 0,
}) / 6;

const metodSimpson2 = ({
	a = A, b = B, n = N, f = F,
}: Input = {}) => buildMetod({
	a,
	b,
	n,
	f: (i) => +(i !== 0) * (i % 2 === 0 ? 2 : 4) * f(a + (b - a) * i / n),
	startSum: f(a) + f(b),
}) / 3;

console.log('n:'.padStart(21), N);
(<[((_: number) => number), number][]>[
	[F, Math.E - 1],
	[function f10(x: number) { return x - Math.trunc(x); }, 1],
]).forEach(([func, orig]) => {
	console.log(func.name);
	console.log([
		metodRectangles.bind(null, { f: func }),
		metodTrapezoids.bind(null, { f: func }),
		metodSimpson1.bind(null, { f: func }),
		metodSimpson2.bind(null, { f: func }),
	]
		.map((e) => `${e.name.split(' ').at(-1)?.padStart(20)}: ${style.yellow(e().toExponential(10))} -> ${style.yellow(Math.abs(orig - e()).toExponential(10))}`).join('\n'));
});
