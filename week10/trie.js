//this is a testing javascript file

let $ = Symbol('$')
class Trie {
	constructor () {
		this.root = Object.create(null);
	}
	insert (word) {
		let node = this.root;
		for (let c of word) {
			if (!node[c]) {
				node[c] = Object.create(null);
			}
			node = node[c]
		}
		if (!($ in node)) {
			node[$] = '0'
		}
		node[$]++
	}
	most () {
		let most_word = '';
		let max = 0;
		function search(node, word) {
			if (!!node[$] && node[$] > max) {
				max = node[$]; 
				most_word = word;
			}
			for (let letter in node) {
				search(node[letter], word + letter);
			}
		}
		search(this.root, '')
		return {
			word: most_word,
			times: max
		}
	}
}

let trie = new Trie();

function generateWord(length) {
	let word = ''
	for (let i = 0; i < length; i++) {
		word += String.fromCharCode(Math.random() * 26 + 'a'.charCodeAt())
	}
	return word;
}

for (let i = 0; i < 100000; i++) {
	trie.insert(generateWord(4))
}
//console.log(trie.root)

console.log(trie.most())


