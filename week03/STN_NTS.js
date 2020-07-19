//字符串转数字
function STN(str) {
	//正则表达式检测进制
	const xReg = /^[0][x][0-9a-fA-F]+$/
	const oReg = /^[0][o]?[0-8]+$/
	const dReg = /^([0]|[1-9])\d*$/
	const bReg = /^[0][b][0-1]+$/
	
	if (xReg.test(str)) {
		console.log("Hexadecimal")
		//console.log(parseInt(str, 16))
		console.log(str.getNumber(16))
	} else if (oReg.test(str)) {
		console.log("Octal")
		//console.log(parseInt(str, 8))
		console.log(str.getNumber(8))
	} else if (bReg.test(str)) {
		console.log("Binary")
		//console.log(parseInt(str, 2))
		console.log(str.getNumber(2))
	} else if (dReg.test(str)) {
		console.log("Decimal")
		console.log(str.getNumber(10))
	} else {
		console.log("please enter a legal number.")
	}
}

//进制转换函数
String.prototype.getNumber = function (radix) {
	const octReg = /^[0][0-8]+$/
	let result = 0;
	let str = radix === 10 ? this : octReg.test(this) ? this.slice(1) : this.slice(2);
	const hexObj = {
		a: 10,
		b: 11,
		c: 12,
		d: 13,
		e: 14,
		f: 15
	}
	
	for (let i = 0; i < str.length; i++) {
		let temp = str[str.length - i -1]
		result += (!!hexObj[temp] ? hexObj[temp] : temp) * (radix ** i)
	}
	return result;
}

STN('1237') // Decimal 1237
STN('013') // Octal 11
STN('0o13') // Octal 11
STN('0b11111') // Binary 31
STN('0x1af') // Hexadecimal 431


//数字转字符串
function NTS (num, radix) {
	//检测是否number
	if (typeof num !== 'number') {
		console.log("please enter a number");
		return;
	}
	
	//检测是否是10进制数
	const dReg = /^([0]|[1-9])\d*$/
	if (!dReg.test(num.toString())) {
		console.log("please enter a decimal number")
		return;
	}
	if (radix === 10) return num.toString()
	
	//进制转换
	let arr = [];
	while (num !== 0) {
		arr.push(num % radix);
		num = Math.floor(num / radix);
	}
	
	const hexObj = {
		10: 'a',
		11: 'b',
		12: 'c',
		13: 'd',
		14: 'e',
		15: 'f'
	}
	
	//生成字符串
	if (radix === 16) {
		return `0x${arr.reverse().map(x => !!hexObj[x] ? hexObj[x] : x).join('')}`
	} else if (radix === 8) {
		return `0o${arr.reverse().join('')}`
	} else if (radix === 2) {
		return `0b${arr.reverse().join('')}`
	}
}

console.log(NTS(234, 16)) //0xea
console.log(NTS(234, 10)) //234
console.log(NTS(234, 8)) // 352
console.log(NTS(234, 2)) // 0b11101010
