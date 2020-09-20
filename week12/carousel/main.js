/*
 * @Author: Clloz
 * @Date: 2020-09-20 11:53:51
 * @LastEditTime: 2020-09-20 23:00:13
 * @LastEditors: Clloz
 * @Description:
 * @FilePath: /carousel/main.js
 * @博观而约取，厚积而薄发，日拱一卒，日进一寸。
 */
import { createElement, Component } from './caroucel';

let imgSrc = ['./images/cat1.jpg', './images/cat2.jpg', './images/cat3.jpg', './images/cat4.jpg'];

class Carousel extends Component {
    constructor() {
        super();
        this.attributes = Object.create(null);
    }
    setAttributes(name, value) {
        this.attributes[name] = value;
    }
    mountTo(parent) {
        console.log(this.attributes);
        parent.appendChild(this.render());
    }
    render() {
        this.root = document.createElement('div');
        console.log(this.attributes);
        this.root.classList.add('carousel');
        for (let attr of this.attributes.src) {
            console.log(attr);
            let el = document.createElement('div');
            el.style.backgroundImage = `url(${attr})`;
            this.root.appendChild(el);
        }

        // mouse event transform
        let index = 0;
        this.root.addEventListener('mousedown', e => {
            let startX = e.clientX;
            let children = this.root.children;

            let move = e => {
                let x = e.clientX - startX;

                let current = index - (x - (x % 500)) / 500;
                // console.log(current);

                // for (let child of children) {
                //     child.style.transition = 'none';
                //     child.style.transform = `translateX(${-index * 500 + x}px)`;
                // }

                for (let offset of [-1, 0, 1]) {
                    let pos = current + offset;
                    pos = (pos + children.length) % children.length;
                    // console.log(pos);

                    children[pos].style.transition = 'none';
                    children[pos].style.transform = `translateX(${-pos * 500 + offset * 500 + (x % 500)}px)`;
                    // console.log(children[pos]);
                }
            };

            let up = e => {
                let x = e.clientX - startX;
                index = (index - Math.round(x / 500)) % children.length;
                // for (let child of children) {
                //     child.style.transition = '';
                //     child.style.transform = `translateX(${-index * 500}px)`;
                // }
                for (let offset of [0, Math.sign(x - (Math.sign(x) * 500) / 2 - Math.round(x / 500))]) {
                    // console.log(offset);
                    let pos = index + offset;
                    pos = (pos + children.length) % children.length;
                    children[pos].style.transition = '';
                    console.log(pos, offset);
                    // children[pos].style.transform = `translateX${-pos * 500 + offset * 500}px`;
                    children[pos].style.transform = `translateX(${(offset - pos) * 500}px)`;
                    console.log(children[pos], children[pos].style.transform);
                }
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', up);
            };
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up);
        });

        //transform loop settimeout
        // let currentIndex = 0;
        // setInterval(() => {
        //     let children = this.root.children;
        //     let nextIndex = (currentIndex + 1) % children.length;
        //     let current = children[currentIndex];
        //     let next = children[nextIndex];
        //     console.log(currentIndex, nextIndex);

        //     next.style.transition = 'none';
        //     next.style.transform = `translateX(${100 - nextIndex * 100}%)`;

        //     setTimeout(() => {
        //         next.style.transition = '';
        //         current.style.transform = `translateX(${-100 - currentIndex * 100}%)`;
        //         next.style.transform = `translateX(${-nextIndex * 100}%)`;
        //         currentIndex = nextIndex;
        //     }, 16);
        // }, 3000);

        return this.root;
    }
}

let el = <Carousel src={imgSrc} />;
el.mountTo(document.body);
