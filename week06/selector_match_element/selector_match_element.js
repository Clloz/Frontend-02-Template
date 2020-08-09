function match(selector, element) {
	let selectors = selector.split(' ');
	for (let i = selectors.length - 1; i >= 0; i--) {
		let result = specificity(selectors[i]);
		
		if (i === selectors.length - 1) {
			if (!compare(result, element)) return false;
		} else {
			let isMatch = false;
			element = element.parentElement;
			console.log(element)
			
			while (element !== null && isMatch === false) {
				console.log(result, element)
				if (compare(result, element)) isMatch = true;
				element = element.parentElement
			}
			console.log(isMatch)
			if (!isMatch) return false;
		}
	}
	return true;
}

function specificity(selector) {
	let reg = /(?<tagname>(\w+)?)(?<id>(#\w+)?)(?<classname>(.[\w.]+)?)/;
	let result = selector.match(reg);
	return result.groups;
}

function compare(result, element) {
	if (result.tagname !== '' && element.tagName.toLowerCase() !== result.tagname) {
		return false;
	}
	if (result.id !== '' && element.getAttribute('id') !== result.id.slice(1)) {
		return false;
	}
	if (result.classname !== '') {
		let classnames = result.classname.split('.').filter(val => !!val);
		let el_classnames = element.getAttribute('class').split(' ');
		let isContain = classnames.every(x => el_classnames.includes(x))
		if (!isContain) return false;
	}
	return true;
}

console.log(match("div.class4 #test.class1.class2", document.getElementById("test")));