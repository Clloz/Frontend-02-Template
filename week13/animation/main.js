/*
 * @Author: Clloz
 * @Date: 2020-09-27 14:48:27
 * @LastEditTime: 2020-09-27 20:40:59
 * @LastEditors: Clloz
 * @Description:
 * @FilePath: /animation/main.js
 * @博观而约取，厚积而薄发，日拱一卒，日进一寸。
 */
import { Timeline, Animation } from './animation';
import { ease, easeIn, easeOut, easeInOut } from './ease';

let el1 = document.getElementById('el1');
let el2 = document.getElementById('el2');
let start = document.getElementById('start');
let pause = document.getElementById('pause');
let resume = document.getElementById('resume');
let reset = document.getElementById('reset');

let tl = new Timeline();
let animation_el1 = new Animation(el1.style, 'transform', 0, 500, 2000, 0, easeIn, v => `translateX(${v}px)`);
let animation_el2 = new Animation(el2.style, 'transform', 0, 500, 2000, 0, null, v => `translateX(${v}px)`);

pause.addEventListener('click', () => {
    tl.pause();
});

resume.addEventListener('click', () => {
    tl.resume();
});

reset.addEventListener('click', () => {
    tl.reset();
});

start.addEventListener('click', () => {
    tl.add(animation_el1);
    tl.add(animation_el2);
});

tl.start();
