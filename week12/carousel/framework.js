/*
 * @Author: Clloz
 * @Date: 2020-09-20 19:23:25
 * @LastEditTime: 2020-09-22 12:03:19
 * @LastEditors: Clloz
 * @Description:
 * @FilePath: /carousel/framework.js
 * @博观而约取，厚积而薄发，日拱一卒，日进一寸。
 */
export class Component {
    constructor() {}
    setAttributes(name, value) {
        console.log(this.root);
        this.root.setAttribute(name, value);
    }
    appendChild(child) {
        child.mountTo(this.root);
    }
    mountTo(parent) {
        parent.appendChild(this.root);
    }
}

class ElementWrapper extends Component {
    constructor(type) {
        super();
        this.root = document.createElement(type);
    }
    mountTo(child) {
        this.root.appendChild(child);
    }
}

class TextWrapper extends Component {
    constructor(content) {
        super();
        this.root = document.createTextNode(content);
    }
}

export function createElement(type, attributes, ...children) {
    let el;
    if (typeof type === 'string') {
        el = new ElementWrapper(type);
    } else {
        el = new type();
    }

    for (let attr in attributes) {
        el.setAttributes(attr, attributes[attr]);
    }

    for (let child in children) {
        if (typeof child === 'string') {
            child = new TextWrapper(child);
        }
        el.appendChild(child);
    }
    return el;
}
