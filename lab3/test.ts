/* eslint-disable no-console */
import style from 'chalk';
import {
	calcABCD, denamFunc, buildFunc, originFunction,
} from '.';

const run = (prefix: string, index: number, orig = originFunction, p?: [number, number][]) => {
	const {
		a, b, c, d, x,
	} = calcABCD(p);

	console.log(style.bold.underline(`> ${prefix}:`));
	if (Number(process.env.GEOGEBRA)) {
		console.log(style.bold.green('GeoGebra:'));
		console.log(`z${index}(x) = If(${a.map((_, i) => `${x[i]} <= x <= ${x[i + 1]}, `
		+ `${a[i]} `
		+ `+ ${b[i]} * (x - ${x[i]})`
		+ `+ ${c[i]} * (x - ${x[i]}) ^ 2`
		+ `+ ${d[i]} * (x - ${x[i]}) ^ 3`).join(', ')})`);
		console.log();
	}

	const func = buildFunc({
		a, b, c, d, x,
	});
	console.log(`[\n  ${style.green('/*   x,       f(x),       g(x),       d(x) */')}\n${a.flatMap((_, i) => [
		x[i],
		(x[i] + x[i + 1]) / 2,
	]).map((e) => [
		e.toFixed(2), func(e).toExponential(5),
		orig(e).toExponential(5), Math.abs(func(e) - orig(e)).toExponential(5)])
		.map((e) => `  [ ${e.map((ei) => style.yellow(ei)).join(', ')} ],\n`).join('')}]`);
	console.log();
};

run('Test', 4, undefined, denamFunc());
run('Result', 5);
