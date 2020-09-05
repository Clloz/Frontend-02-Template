//this is a testing javascript file
let regexp = /([0-9\.]+)|([ \t]+)|([\r\n]+)|(\+)|(-)|(\*)|(\/)/g;

let dictionary = ['Number', 'WhiteSpace', 'LineTerminator', '+', '-', '*', '/'];

function tokenize(expr) {
	let result = null;
	loop: while (true) {
		result = regexp.exec(expr);
		if (!result) break;
		for (let i =0; i < dictionary.length; i++) {
			if (result[i + 1]) {
				console.log(dictionary[i]);
				continue loop;
			}
			//console.log(result);
		}
	}
}

tokenize('1 + 2');
console.log('')
tokenize('1024 + 10 * 25')