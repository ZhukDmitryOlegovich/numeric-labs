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

const metodRectangles = (f = F) => ({
	a = A, b = B, n = N,
}: Input = {}) => buildMetod({
	a, b, n, f: (i) => f(a + (b - a) * (2 * i + 1) / (2 * n)), startSum: 0,
}) * (b - a);

const metodTrapezoids = (f = F) => ({
	a = A, b = B, n = N,
}: Input = {}) => buildMetod({
	a, b, n, f: (i) => f(a + (b - a) * i / n) + f(a + (b - a) * (i + 1) / n), startSum: 0,
}) * (b - a) / 2;

const metodSimpson1 = (f = F) => ({
	a = A, b = B, n = N,
}: Input = {}) => buildMetod({
	a,
	b,
	n,
	f: (i) => f(a + (b - a) * i / n)
		+ 4 * f(a + (b - a) * (2 * i + 1) / (2 * n))
		+ f(a + (b - a) * (i + 1) / n),
	startSum: 0,
}) * (b - a) / 6;

const metodSimpson2 = (f = F) => ({
	a = A, b = B, n = N,
}: Input = {}) => buildMetod({
	a,
	b,
	n,
	f: (i) => +(i !== 0) * (i % 2 === 0 ? 2 : 4) * f(a + (b - a) * i / n),
	startSum: f(a) + f(b),
}) * (b - a) / 3;

(<[((_: number) => number), number][]>[
	[F, Math.E - 1],
	// [function f10(x: number) { return x - Math.trunc(x); }, 1],
]).forEach(([func, orig]) => {
	console.log(func.name, 'n:', N);
	console.log((<[((i?: Input) => number), string][]>[
		[metodRectangles(func), 'metodRectangles'],
		[metodTrapezoids(func), 'metodTrapezoids'],
		[metodSimpson1(func), 'metodSimpson1'],
		[metodSimpson2(func), 'metodSimpson2'],
	])
		.map(([e, name]) => `${name.padStart(20)}: ${style.yellow(e().toExponential(10))} -> ${style.yellow(Math.abs(orig - e()).toExponential(10))}`).join('\n'));
});

(<[((_: number) => number), number, number, number, number][]>[
	[F, Math.E - 1, 1e-2, 0, 1],
	[
		function v10(x) { return x * Math.sin(x) ** 2; },
		Math.PI ** 2 / 4,
		1e-2,
		0,
		Math.PI,
	],
	// [function f10(x: number) { return x - Math.trunc(x); }, 1],
]).forEach(([func, orig, eps, a, b]) => {
	console.log(func.name, eps, orig);
	console.log((<[((i?: Input) => number), string, number][]>[
		[metodRectangles(func), 'metodRectangles', 2],
		[metodTrapezoids(func), 'metodTrapezoids', 2],
		[metodSimpson1(func), 'metodSimpson1', 4],
		[metodSimpson2(func), 'metodSimpson2', 4],
	])
		.map(([e, name, step]) => {
			for (let n = 2; ; n *= 2) {
				const value = e({ n, a, b });
				const epsGot = value - orig;
				if (Math.abs(epsGot) < eps) {
					const newValue = e({ n: n * 2, a, b });
					const r = (value - newValue) / (2 ** step - 1);
					const ideal = value - r;
					return `${name.padStart(20)}: ${style.yellow(n)} ${style.yellow(value.toExponential(10))} ${style.yellow(newValue.toExponential(10))} ${style.yellow(ideal.toExponential(10))} ${style.yellow(Math.abs(orig - ideal).toExponential(10))}`;
				}
			}
		}).join('\n'));
});

(<[((_: number) => number), number, number, number, number, number][]>[
	[F, Math.E - 1, 1e-2, 0, 1, Math.E],
	[
		function v10(x) { return x * Math.sin(x) ** 2; },
		Math.PI ** 2 / 4,
		1e-2,
		0,
		Math.PI,
		Math.PI,
	],
	// [function f10(x: number) { return x - Math.trunc(x); }, 1],
]).forEach(([func, orig, eps, a, b, max]) => {
	let correct = 1;
	let all = 1;
	let n = 2;
	for (; Math.abs(correct / all - orig / (max * (b - a))) > eps; n *= 2) {
		for (let i = 0; i < n; i++) {
			if (func(a + (b - a) * Math.random()) > Math.random() * max) {
				correct++;
			}
		}
		all += n;
	}
	console.log(func.name, 'Monte Carlo:'.padStart(17), n, all, correct / all * (max * (b - a)));
});
