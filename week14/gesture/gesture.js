/*
 * @Author: Clloz
 * @Date: 2020-10-04 07:14:57
 * @LastEditTime: 2020-10-04 23:09:54
 * @LastEditors: Clloz
 * @Description: gesture library
 * @FilePath: /gesture/gesture.js
 * @博观而约取，厚积而薄发，日拱一卒，日进一寸。
 */
//tap pan press flick
let el = document.documentElement;
el.addEventListener('contextmenu', e => {
    e.preventDefault();
});
let contexts = new Map();
let isListening = false;

el.addEventListener('mousedown', e => {
    let context = Object.create(null);
    start(e, context);
    contexts.set('mouse' + (1 << e.button), context);

    let mousemove = e => {
        let button = 1;
        // console.log(button, e.buttons);
        while (button <= e.buttons) {
            let key;
            if (button === 2) {
                key = 4;
            } else if (button === 4) {
                key = 2;
            } else {
                key = button;
            }
            if (button & e.buttons) {
                let context = contexts.get('mouse' + key);
                move(e, context);
            }
            button <<= 1;
        }
    };

    let mouseup = e => {
        let context = contexts.get('mouse' + (1 << e.button));
        end(e, context);
        contexts.delete('mouse' + (1 << e.button));
        if (e.buttons === 0) {
            document.removeEventListener('mousemove', mousemove);
            document.removeEventListener('mouseup', mouseup);
            isListening = false;
        }
    };

    if (!isListening) {
        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);
        isListening = true;
    }
});

el.addEventListener('touchstart', e => {
    console.log('start');
    for (let touch of e.changedTouches) {
        let context = Object.create(null);
        contexts.set(touch.identifier, context);
        start(touch, context);
    }
});

el.addEventListener('touchmove', e => {
    for (let touch of e.changedTouches) {
        let context = contexts.get(touch.identifier);
        move(touch, context);
    }
});

el.addEventListener('touchend', e => {
    for (let touch of e.changedTouches) {
        let context = contexts.get(touch.identifier);
        end(touch, context);
        contexts.delete(touch.identifier);
    }
});

el.addEventListener('touchcancel', e => {
    for (let touch of e.changedTouches) {
        let context = contexts.get(touch.identifier);
        cancel(touch, context);
        contexts.delete(touch.identifier);
    }
});

function start(point, context) {
    context.startX = point.clientX;
    context.startY = point.clientY;
    context.isTap = true;
    context.isPress = false;
    context.isPan = false;

    context.points = [
        {
            t: Date.now(),
            x: point.clientX,
            y: point.clientY,
        },
    ];

    context.handler = setTimeout(() => {
        context.isTap = false;
        context.isPress = true;
        context.isPan = false;
        context.handler = null;
        console.log('pressstart');
    }, 500);
}

function move(point, context) {
    let dx = point.clientX - context.startX;
    let dy = point.clientY - context.startY;
    let distance = dx ** 2 + dy ** 2;

    if (!context.isPan && distance >= 100) {
        context.isTap = false;
        context.isPress = false;
        context.isPan = true;
        clearTimeout(context.handler);
        console.log('panstart');
    }

    context.points = context.points.filter(point => Date.now() - point.t < 500);
    context.points.push({
        t: Date.now(),
        x: point.clientX,
        y: point.clientY,
    });
}

function end(point, context) {
    if (context.isTap) {
        clearTimeout(context.handler);
        console.log('tap');
        dispatch('tap', {});
    }
    if (context.isPress) {
        console.log('pressend');
    }
    if (context.isPan) {
        console.log('panend');
    }
    context.points = context.points.filter(point => Date.now() - point.t < 500);
    let v = 0;
    if (!!context.points.length) {
        let d = Math.sqrt((point.clientX - context.points[0].x) ** 2 + (point.clientY - context.points[0].y) ** 2);
        v = d / (Date.now() - context.points[0].t);
    }
    console.log(v);
    if (v > 1.5) {
        console.log('flick');
        context.isFlick = true;
    } else {
        context.isFlick = false;
    }
}

function cancel(point, context) {
    clearTimeout(context.handler);
    console.log('cancel');
}

function dispatch(type, properties) {
    let event = new Event(type);
    for (let name in properties) {
        event[name] = properties[name];
    }
    el.dispatchEvent(event);
}
