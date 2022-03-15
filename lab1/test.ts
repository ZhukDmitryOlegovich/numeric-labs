import {
	read, solveProgon, format, makeResult, solveGaus, more,
} from '.';

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
