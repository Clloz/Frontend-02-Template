/*
 * @Author: Clloz
 * @Date: 2020-09-27 14:49:54
 * @LastEditTime: 2020-09-27 20:46:31
 * @LastEditors: Clloz
 * @Description:
 * @FilePath: /animation/animation.js
 * @博观而约取，厚积而薄发，日拱一卒，日进一寸。
 */
const TICK = Symbol('tick');
const TICK_HANDLER = Symbol('tick handler');
const ANIMATIONS = Symbol('animations');
const MOVETIME = Symbol('movetime');
const PAUSE_START = Symbol('pause start');
const PAUSE_TIME = Symbol('pause time');

export class Timeline {
    constructor() {
        this.state = 'inited';
        this[ANIMATIONS] = new Set();
        this[MOVETIME] = new Map();
    }
    start() {
        if (this.state !== 'inited') return;
        this.state = 'started';
        let startTime = Date.now();
        this[PAUSE_TIME] = 0;
        console.log(startTime);
        this[TICK] = () => {
            let now = Date.now();
            for (let animation of this[ANIMATIONS]) {
                let t;
                if (this[MOVETIME].get(animation) < startTime) {
                    t = now - startTime - this[PAUSE_TIME] - animation.delay;
                } else {
                    t = now - this[MOVETIME].get(animation) - this[PAUSE_TIME] - animation.delay;
                }
                if (t > animation.duration) {
                    this[ANIMATIONS].delete(animation);
                    t = animation.duration;
                }
                if (t > 0) animation.trans(t);
            }
            this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
        };
        this[TICK]();
    }
    pause() {
        if (this.state !== 'started') return;
        this.state = 'paused';
        this[PAUSE_START] = Date.now();
        cancelAnimationFrame(this[TICK_HANDLER]);
    }
    resume() {
        if (this.state !== 'paused') return;
        this.state = 'started';
        this[PAUSE_TIME] += Date.now() - this[PAUSE_START];
        this[TICK]();
    }
    reset() {
        this.pause();
        this.state = 'inited';
        // let startTime = Date.now();
        this[ANIMATIONS] = new Set();
        this[MOVETIME] = new Map();
        this[TICK_HANDLER] = null;
        this[PAUSE_START] = 0;
    }
    add(animation, startTime) {
        if (arguments.length < 2) {
            startTime = Date.now();
        }
        this[ANIMATIONS].add(animation);
        this[MOVETIME].set(animation, startTime);
    }
}

export class Animation {
    constructor(obj, prop, startVal, endVal, duration, delay, timeFunc, template) {
        timeFunc = timeFunc || (v => v);
        template = template || (v => v);
        this.obj = obj;
        this.prop = prop;
        this.startVal = startVal;
        this.endVal = endVal;
        this.duration = duration;
        this.delay = delay;
        this.timeFunc = timeFunc;
        this.template = template;
    }
    trans(time) {
        console.log(time);
        let range = this.endVal - this.startVal;
        let progress = this.timeFunc(time / this.duration);
        this.obj[this.prop] = this.template(this.startVal + range * progress);
    }
}
