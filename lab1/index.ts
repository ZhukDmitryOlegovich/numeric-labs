import * as fs from 'fs';

const verbose = (...args: any[]) => {
	if (Number(process.env.VERBOSE)) {
		// eslint-disable-next-line no-console
		console.log(...args);
	}
};

const more = <T, K>(arg: T, callback: (v: T) => K) => (
	Number(process.env.MORE) ? callback(arg) : arg
);

type InputType = {a: number[], b: number[], c: number[], d: number[], n: number};

const read = (name: string): InputType => {
	const elems = fs.readFileSync(name, { encoding: 'utf8' })
		.split(/[\s\n]+/g)
		.filter(Boolean)
		.map(Number);
	const n = +(elems.shift() || 0);
	const ans = {
		n,
		a: elems.splice(0, n - 1),
		b: elems.splice(0, n),
		c: elems.splice(0, n - 1),
		d: elems.splice(0, n),
	};

	verbose('read:', { name, ans });

	return ans;
};

const solveProgon = ({
	a, b, c, d, n,
}: InputType) => {
	const alpha: number[] = [];
	const beta: number[] = [];

	for (let i = 0; i < n; i++) {
		const denominator = (a[i - 1] || 0) * (alpha[i - 1] || 0) + b[i];
		alpha.push(-c[i] / denominator);
		beta.push((d[i] - (a[i - 1] || 0) * (beta[i - 1] || 0)) / denominator);
	}

	const x: number[] = [];

	for (let i = n - 1; i >= 0; i--) {
		x[i] = (alpha[i] || 0) * (x[i + 1] || 0) + beta[i];
	}

	verbose('solve:', { alpha, beta, x });

	return x;
};

type FormatType = {m: number[][], d: number[], n: number};

const format = ({
	a, b, c, d, n,
}: InputType): FormatType => {
	const m = Array.from({ length: n }, () => Array.from({ length: n }, () => 0));

	a.forEach((v, i) => { m[i + 1][i] = v; });
	b.forEach((v, i) => { m[i][i] = v; });
	c.forEach((v, i) => { m[i][i + 1] = v; });

	const ans = { m, d, n };

	verbose('format:', ans);

	return ans;
};

const clone = <T>(c: T): T => (Array.isArray(c) ? c.map(clone) : c) as T;

const solveGaus = ({ d: d1, m: m1, n }: FormatType) => {
	const d = clone(d1);
	const m = clone(m1);

	for (let j = 0; j < n; j++) {
		d[j] /= m[j][j];
		for (let i = n - 1; i >= j; i--) {
			m[j][i] /= m[j][j];
		}

		for (let k = j + 1; k < n; k++) {
			d[k] -= m[k][j] * d[j];
			for (let i = n - 1; i >= j; i--) {
				m[k][i] -= m[k][j] * m[j][i];
			}
		}
	}

	for (let j = n - 1; j >= 0; j--) {
		for (let i = j - 1; i >= 0; i--) {
			d[i] -= d[j] * m[i][j];
		}
	}

	verbose('solveGaus:', m, d);

	return d;
};

const makeResult = ({ m, n }: FormatType, x: number[]) => Array
	.from({ length: n }, (_, i) => {
		let di = 0;
		for (let j = 0; j < n; j++) {
			di += m[i][j] * x[j];
		}
		return di;
	});

const inp = read(process.argv[2]);

const s1 = solveProgon(inp);
const f = format(inp);
const s2 = solveGaus(f);
const r = makeResult(f, s1);

/* eslint-disable no-console */
console.log('прогон:     ', s1);
console.log('Гаус:       ', s2);
console.log('разница:    ', more(s1.map((e, i) => (e - s2[i])), (s) => s.map((e) => e.toFixed(20))));
console.log('подстановка:', r);
console.log('разница:    ', more(inp.d.map((e, i) => (e - r[i])), (s) => s.map((e) => e.toFixed(20))));
/* eslint-enable no-console */
