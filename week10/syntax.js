//this is a testing javascript file
let regexp = /([0-9\.]+)|([ \t]+)|([\r\n]+)|(\+)|(-)|(\*)|(\/)/g;

let dictionary = ['Number', 'WhiteSpace', 'LineTerminator', '+', '-', '*', '/'];

function* tokenize(expr) {
	let result = null;
	let lastIndex = 0;
	while (true) {
		lastIndex = regexp.lastIndex;
		result = regexp.exec(expr);
		
		if (!result) break;
		if (regexp.lastIndex - lastIndex > result[0].length) break;
		
		let token = {
			type: '',
			value: ''
		}
		for (let i = 0; i < dictionary.length; i++) {
			if (result[i + 1]) {
				token.type = dictionary[i]
				token.value = result[i + 1];
				//continue loop;
			}
		}
		yield token;
	}
	yield {
		type: 'EOF'
	}
}

let source = []
for (let token of tokenize('1024 + 10 * 25')) {
	if (token.type !== 'WhiteSpace' && token.type !== 'LineTerminator') {
		source.push(token);
	}
}

function expression(source) {
	if (source[0].type === 'AdditiveExpression' && !!source[1] && source[1].type === 'EOF') {
		let node = {
			type: 'Expression',
			children: [...source.splice(0, 2)]
		}
		source.unshift(node);
		return source;
	}
	additiveExpression(source)
	return expression(source)
}

function additiveExpression(source) {
	if (source[0].type === 'MultiplicativeExpression') {
		let node = {
			type: 'AdditiveExpression',
			children: [source[0]]
		}
		source[0] = node;
		return additiveExpression(source)
	}
	if (source[0].type === 'AdditiveExpression' && !!source[1] && source[1].type === '+') {
		let node = {
			type: 'AdditiveExpression',
			children: [...source.splice(0, 2)]
		}
		multiplicativeExpression(source);
		node.children.push(source.splice(0, 1));
		source.unshift(node);
		return additiveExpression(source);
	}
	if (source[0].type === 'AdditiveExpression' && !!source[1] && source[1].type === '-') {
		let node = {
			type: 'AdditiveExpression',
			children: [...source.splice(0, 2)]
		}
		multiplicativeExpression(source);
		node.children.push(source.splice(0, 1));
		source.unshift(node);
		return additiveExpression(source);
	}
	if (source[0].type === 'AdditiveExpression') return source[0];
	multiplicativeExpression(source);
	return additiveExpression(source);
}

function multiplicativeExpression(source) {
	if (source[0].type === 'Number') {
		let node = {
			type: 'MultiplicativeExpression',
			childeren: [source[0]]
		}
		source[0] = node;
		return multiplicativeExpression(source);
	}
	if (source[0].type === 'MultiplicativeExpression' && !!source[1] && source[1].type === '*') {
		let node  = {
			type: 'MultiplicativeExpression',
			children: [...source.splice(0, 3)]
		}
		source.unshift(node);
		return multiplicativeExpression(source);
	}
	if (source[0].type === 'MultiplicativeExpression' && !!source[1] && source[1].type === '/') {
		let node  = {
			type: 'MultiplicativeExpression',
			children: [...source.splice(0, 3)]
		}
		source.unshift(node);
		return multiplicativeExpression(source);
	}
	if (source[0].type === 'MultiplicativeExpression') return source[0];
}

expression(source)
console.log(source)