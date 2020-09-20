/*
 * @Author: Clloz
 * @Date: 2020-09-20 11:53:51
 * @LastEditTime: 2020-09-21 03:20:40
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

                //拖动的整数屏
                let current = index - (x - (x % 500)) / 500;
                // console.log(current);

                // for (let child of children) {
                //     child.style.transition = 'none';
                //     child.style.transform = `translateX(${-index * 500 + x}px)`;
                // }

                for (let offset of [-1, 0, 1]) {
                    //计算可能出现的图片下标
                    let pos = current + offset;
                    pos = (pos + children.length) % children.length; //要处理大屏幕拖动小于 -children.length 的情况

                    children[pos].style.transition = 'none';
                    children[pos].style.transform = `translateX(${-pos * 500 + offset * 500 + (x % 500)}px)`; //当前，前一个，后一个图片当前位置
                }
            };

            let up = e => {
                let x = e.clientX - startX;

                //index不变，向下取整，需要分情况，可读性好
                // console.log((x - (x % 500)) / 500);
                // index = (index - (x - (x % 500)) / 500) % children.length; //计算出当前占面积更大的图片下标
                // index = (index + children.length) % children.length;
                // let base = x % 500;
                // console.log(index, base);

                // if (base > 0) {
                //     if (base > 250) {
                //         children[index].style.transition = '';
                //         children[index].style.transform = `translateX(${(-index + 1) * 500}px)`;
                //         let pre = index === 0 ? children.length - 1 : index - 1;
                //         children[pre].style.transition = '';
                //         children[pre].style.transform = `translateX(${-pre * 500}px)`;
                //         index = pre;
                //     } else {
                //         children[index].style.transition = '';
                //         children[index].style.transform = `translateX(${-index * 500}px)`;
                //         let pre = index === 0 ? children.length - 1 : index - 1;
                //         children[pre].style.transition = '';
                //         children[pre].style.transform = `translateX(${(-pre - 1) * 500}px)`;
                //     }
                // }
                // if (base < 0) {
                //     if (base < -250) {
                //         children[index].style.transition = '';
                //         children[index].style.transform = `translateX(${(-index - 1) * 500}px)`;
                //         let pre = index === 3 ? 0 : index + 1;
                //         children[pre].style.transition = '';
                //         children[pre].style.transform = `translateX(${-pre * 500}px)`;
                //         index = pre;
                //     } else {
                //         children[index].style.transition = '';
                //         children[index].style.transform = `translateX(${-index * 500}px)`;
                //         let pre = index === 3 ? 0 : index + 1;
                //         children[pre].style.transition = '';
                //         children[pre].style.transform = `translateX(${(-pre + 1) * 500}px)`;
                //     }
                // }

                //index 四舍五入，代码简洁，不易理解，主要是利用四舍五入，统一了要从可视范围移出的元素的下标
                console.log(index, Math.round(x / 500));
                index = (index - Math.round(x / 500)) % children.length;
                index = (index + children.length) % children.length; //四舍五入，得到的就是mouseup触发后应该显示的图片下标
                let base = x % 500;
                console.log(index, base);
                console.log((Math.abs(base) > 250 ? 1 : -1) * Math.sign(base)); //根据是否超过一半以及正负来判断offset
                for (let offset of [0, (Math.abs(base) > 250 ? 1 : -1) * Math.sign(base)]) {
                    let pos = (index + offset + children.length) % children.length; //获得另一个要移动的图片的下标（要移除可视范围的图片）
                    children[pos].style.transition = '';
                    children[pos].style.transform = `translateX(${(offset - pos) * 500}px)`; //一个下标为index图片要显示它的偏移量是 -index, 偏移量 -1 表示再向左移动一个图片单位，偏移量 1 表示向右移动一个图片单位，最后的总偏移量为 -index + offset
                }
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', up);
            };
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up);
        });

        // transform loop settimeout
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
