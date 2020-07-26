//共三种实现
//第一种是dfm状态机匹配所有扩展ASCII码，这种代码比较简单，但会生成很大的数组
//第二种是检测是否是pattern中的字符，不是则状态直接归0
//第三种是基于部分匹配表的实现

//DFM状态机匹配所有ASCII码
function match(s, p) {
	let M = p.length,
		N = s.length,
		i = 0,
		j = 0,
		dfa = KMP(p);
		
	for (; i < N && j < M; i++) j = dfa[j][s.charCodeAt(i)];
	if (j === M) return 'match success at index of ' + (i - M);
	return 'false';
}

function KMP(p) {
	let X = 0,
		R = 256,
		M = p.length,
		dfa = new Array(M);
	for (let i = 0; i < dfa.length; i++) dfa[i] = new Array(R); //创建长度为dfa.length的数组，每一项为一个对象
	
	//初始化dfa[0],即初始的X状态，后面的状态要用这一状态来复制
	for (let i = 0; i < R; i++) dfa[0][i] = 0;
	dfa[0][p.charCodeAt(0)] = 1; //状态0时匹配到第一位总是进入状态1
	
	//生成后面的状态机
	for (let j = 1; j < M; j++) {
		for (let c = 0; c < R; c++) dfa[j][c] = dfa[X][c]	//设置状态j的匹配失败项，从状态X复制
		dfa[j][p.charCodeAt(j)] = j + 1;//设置匹配成功项
		X = dfa[X][p.charCodeAt(j)] //计算下一阶段的 X
	}
	return dfa;
}

console.log(match('asdfasdfsafabababafabababacasdf', 'ababac'));

//DFM检测是否是pattern中的字符
function match(s, p) {
	let M = p.length,
		N = s.length,
		i = 0,
		j = 0,
		o = {},
		dfa = KMP(p);
		
	//生成pattern中不重复元素的对象
	for (let t of p) {
		if (!o[t]) o[t] = t; 
	}
		
	for (; i < N && j < M; i++) {
		j = !!o[s[i]] ? dfa[j][s[i]] : 0;
	}
	if (j === M) return 'match success at index of ' + (i - M);
	return 'false';
}

function KMP(p) {
	let X = 0,
		R = 256,
		M = p.length,
		o = {},
		dfa = new Array(M);
		
	//生成pattern中不重复元素的对象
	for (let t of p) {
		if (!o[t]) o[t] = t; 
	}
	
	for (let i = 0; i < dfa.length; i++) dfa[i] = {...o}; //创建长度为dfa.length的数组，每一项为一个对象
	
	//初始化dfa[0],即初始的X状态，后面的状态要用这一状态来复制
	for (let key in dfa[0]) {
		dfa[0][key] = 0;
	}
	dfa[0][p[0]] = 1; //状态0时匹配到第一位总是进入状态1
	
	//生成后面的状态机
	for (let j = 1; j < M; j++) {
		for (let c in o) dfa[j][c] = dfa[X][c]	//设置状态j的匹配失败项，从状态X复制
		dfa[j][p[j]] = j + 1;//设置匹配成功项
		X = dfa[X][p[j]] //计算下一阶段的 X
	}
	console.log(dfa)
	return dfa;
}

console.log(match('asdfasdfsafabababafabababacasdf', 'ababac'));

//[
//	{ a: 1, b: 0, c: 0 },
//	{ a: 1, b: 2, c: 0 },
//	{ a: 3, b: 0, c: 0 },
//	{ a: 1, b: 4, c: 0 },
//	{ a: 5, b: 0, c: 0 },
//	{ a: 1, b: 4, c: 6 }
//]
//match success at index of 21

//基于PTM部分匹配表的实现
function match(s, p) {
	let i = 0,
		j = 0,
		arr = PMT(p);

	while (i < s.length) {
		if (j === -1 || s[i] === p[j]) {
			if (j === arr.length - 1) return 'success';
			i++;
			j++;
		} else {
			j = arr[j];
		}
	}
	return 'failed';
}

//生成数组后偏移
function PMT(p) {
	let i = 1,
		j = 0,
		arr = [0];

	while (i < p.length) {
		if (p[i] === p[j]) {
			j++;
			arr[i] = j;
			i++;
		} else if (j === 0){
			arr[i] = 0;
			i++;
		} else {
			j = arr[j - 1];
		}
	}
	arr.unshift(-1);
	arr.pop()
	return arr;
}

//直接生成偏移数组
function PTM2(p) {
	let arr = [-1];
	let i = 0, j = -1;

	while (i < p.length)
	{
		if (j == -1 || p[i] == p[j])
		{
			++i;
			++j;
			arr[i] = j;
		}
		else
			j = arr[j];
	}
	arr.pop();
	return arr;
}
console.log(PTM2('abababca'))

console.log(match('abababccabababca', 'abababca'))
//[
//  -1, 0, 0, 1,
//	2, 3, 4, 0
//]
//success
