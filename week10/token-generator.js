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


for (let token of tokenize('1024 + 10 * 25')) {
	console.log(token)
}

//let a = tokenize('1024 + 10 * 25')
//console.log(a.next())
//{ value: { type: 'Number', value: '1024' }, done: false }