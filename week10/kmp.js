// 用有限确定自动机实现KMP算法
function match(s, p) {
	if (p.length === 0 || s.length === 0) return 0;
	let state = 0,
		dfa = KMP(p);
	
	for (let i = 0; i < s.length && state < p.length; i++) {
		state = dfa[state][s.charCodeAt(i)];
		if (state === p.length) return i - p.length + 1;
	}
	return -1;
}

function KMP(p) {
	let X = 0,
		R = 256, //ASCII 字符数
		M = p.length,
		dfa = new Array(M);
	
	for (let i = 0; i < M; i++) dfa[i] = new Array(R);
	
	for (let i = 0; i < R; i++) dfa[0][i] = X;
	dfa[0][p.charCodeAt(0)] = 1;
	
	for (let i = 1; i < M; i++) {
		for (let j = 0; j < R; j++) {
			if (j === p.charCodeAt(i)) {
				dfa[i][j] = i + 1;
			} else  {
				dfa[i][j] = dfa[X][j];
			}
		}
		X = dfa[X][p.charCodeAt(i)]
	}
	//console.log(dfa)
	return dfa;
}

console.log(match('asdfasdfsafabababafabababacasdf', 'ababac'))

