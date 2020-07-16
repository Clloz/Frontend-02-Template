function utf8_encoding1 (str) {
	const code = encodeURIComponent(str);
	const byte = [];
	for (let i = 0; i < code.length; i++) {
		const c = code.charAt(i);
		if (c === '%') {
			const hex = code.charAt(i + 1) + code.charAt(i + 2);
			const hexVal = parseInt(hex, 16);
			byte.push(hexVal);
			i += 2;
		} else byte.push(c.charCodeAt(0))
	}
	return '0x' + byte.map(c => c.toString(16)).join('');
}
console.log(utf8_encoding1('𝌆')) //0xf09d8c86


function utf8_encoding2 (str) {
	const length = str.length;
	let arr = [];
	for (let i = 0; i < length; i++) {
		let cp = str.codePointAt(i);
		let result = '0x';
		if (cp <= 0x7F) {
			result += cp & 0x7F
		} else if (cp >= 0x80 && cp <= 0x7FF) {
			result += (cp >> 6 & 0x1F | 0xC0).toString(16)
			result += (cp & 0x3F | 0x80).toString(16)
		} else if (cp >= 0x800 && cp <= 0xFFFF) {
			result += (cp >> 12 & 0xF | 0xE0).toString(16)
			result += (cp >> 6 & 0x3F | 0x80).toString(16)
			result += (cp & 0x3F | 0x80).toString(16)
		} else if (cp >= 0x10000 && cp <= 0x10FFFF) {
			result += (cp >> 18 & 0x7 | 0xF0).toString(16)
			result += (cp >> 12 & 0x3F | 0x80).toString(16)
			result += (cp >> 6 & 0x3F | 0x80).toString(16)
			result += (cp & 0x3F | 0x80).toString(16)
		}
		arr.push(result)
	}
	return arr
}

console.log(utf8_encoding2('𝌆')) //[ '0xf09d8c86', '0xedbc86' ]
