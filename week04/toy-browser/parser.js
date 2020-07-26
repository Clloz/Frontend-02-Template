/*
 * @Author: Clloz
 * @Date: 2020-07-26 02:26:43
 * @LastEditTime: 2020-07-26 19:15:14
 * @LastEditors: Clloz
 * @Description: parse html, build DOM tree
 * @FilePath: /toy-browser/parser.js
 * @博观而约取，厚积而薄发，日拱一卒，日进一寸，学不可以已。
 */
const EOF = Symbol('EOF'); //end of file

let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;
let stack = [{ type: 'document', children: [] }];

function emit(token) {
    //console.log(token);
    let top = stack[stack.length - 1];

    if (token.type === 'startTag') {
        let element = {
            type: 'element',
            tagName: token.tagName,
            children: [],
            attributes: [],
        };

        for (let p in token) {
            if (p != 'type' && p != 'tagName') {
                element.attributes.push({
                    name: p,
                    value: token[p],
                });
            }
        }

        top.children.push(element);
        element.parent = top;

        if (!token.isSelfClosing) {
            stack.push(element);
        }
        currentTextNode = null;
    } else if (token.type === 'endTag') {
        if (top.tagName != token.tagName) {
            throw new Error("Tag start and end don't match");
        } else {
            stack.pop();
        }
        currentTextNode = null;
    } else if (token.type === 'text') {
        if (currentTextNode === null) {
            currentTextNode = {
                type: 'text',
                content: '',
            };
            top.children.push(currentTextNode);
        }
        currentTextNode.content += token.content;
    }
}

function data(c) {
    if (c === '<') {
        return tagOpen;
    } else if (c === EOF) {
        emit({
            type: 'EOF',
        });
        return;
    } else {
        emit({
            type: 'text',
            content: c,
        });
        return data;
    }
}

//tag parse
function tagOpen(c) {
    if (c === '/') {
        return endTagOpen;
    } else if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: 'startTag',
            tagName: '',
        };
        return tagName(c);
    } else {
        return;
    }
}

function endTagOpen(c) {
    if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: 'endTag',
            tagName: '',
        };
        return tagName(c);
    } else if (c === '>') {
    } else if (c === EOF) {
    } else {
    }
}

function tagName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (c === '/') {
        return selfClosingStartTag;
    } else if (c.match(/^[a-zA-z]$/)) {
        currentToken.tagName += c; //.toLowerCase()
        return tagName;
    } else if (c === '>') {
        emit(currentToken);
        return data;
    } else {
        return tagName;
    }
}

function selfClosingStartTag(c) {
    if (c === '>') {
        currentToken.isSelfClosing = true;
        emit(currentToken);
        return data;
    } else if (c === EOF) {
    } else {
    }
}

//attribute parse
function beforeAttributeName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (c === '>' || c === '/' || c === EOF) {
        return afterAttributeName(c);
    } else if (c === '=') {
        return attributeName;
    } else {
        currentAttribute = {
            name: '',
            value: '',
        };
        return attributeName(c);
    }
}

function attributeName(c) {
    if (c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF) {
        return afterAttributeName(c);
    } else if (c === '=') {
        return beforeAttributeValue;
    } else if (c === '\u0000') {
    } else if (c === '"' || c === "'" || c === '<') {
    } else {
        currentAttribute.name += c;
        return attributeName;
    }
}

function afterAttributeName(c) {
    if (c.match(/^[\t\b\f ]$/)) {
        return afterAttributeName;
    } else if (c === '/') {
        return selfClosingStartTag;
    } else if (c === '=') {
        return beforeAttributeValue;
    } else if (c === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c === EOF) {
        emit({
            type: EOF,
        });
    } else {
        currentToken[currentAttribute.name] = currentAttribute.value;
        currentAttribute = {
            name: '',
            value: '',
        };
        return attributeName(c);
    }
}

function beforeAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF) {
        return beforeAttributeValue;
    } else if (c === '"') {
        return doubleQoutedAttributeValue;
    } else if (c === "'") {
        return singleQuotedAttributeValue;
    } else if (c === '>') {
        // return data; 此处为什么注释掉？
    } else {
        return unQuotedAttributeValue;
    }
}

function doubleQoutedAttributeValue(c) {
    if (c === '"') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if (c === '\u0000') {
    } else if (c === EOF) {
        emit({
            type: EOF,
        });
    } else {
        currentAttribute.value += c;
        return doubleQoutedAttributeValue;
    }
}

function singleQuotedAttributeValue(c) {
    if (c === "'") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if (c === '\u0000') {
    } else if (c === EOF) {
        emit({
            type: EOF,
        });
    } else if (c === '&') {
        console.log(c);
    } else {
        currentAttribute.value += c;
        return singleQuotedAttributeValue;
    }
}

function unQuotedAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    } else if (c === '/') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    } else if (c === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c === EOF) {
    } else if (c === '\u0000') {
    } else if (c === '"' || c === "'" || c === '>' || c === '`') {
    } else {
        currentAttribute.value += c;
        return unQuotedAttributeValue;
    }
}

function afterQuotedAttributeValue(c) {
    if (c.match(/^[\t\f\n ]$/)) {
        return beforeAttributeName;
    } else if (c === '/') {
        return selfClosingStartTag;
    } else if (c === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c === EOF) {
        emit({
            type: EOF,
        });
    } else {
        return beforeAttributeName(c);
    }
}

module.exports.parseHTML = function parseHTML(html) {
    console.log(html);
    let state = data;
    for (let c of html) {
        state = state(c);
    }
    state = state(EOF);
    //console.log(stack[0]);
    return stack[0];
};
