"use strict";
exports.__esModule = true;
exports.trigger = exports.track = exports.resetTracking = exports.enableTracking = exports.pauseTracking = exports.stop = exports.effect = exports.isEffect = exports.MAP_KEY_ITERATE_KEY = exports.ITERATE_KEY = void 0;
var operations_1 = require("./operations");
var shared_1 = require("@vue/shared");
var targetMap = new WeakMap();
var effectStack = [];
var activeEffect;
exports.ITERATE_KEY = Symbol(__DEV__ ? 'iterate' : '');
exports.MAP_KEY_ITERATE_KEY = Symbol(__DEV__ ? 'Map key iterate' : '');
function isEffect(fn) {
    return fn && fn._isEffect === true;
}
exports.isEffect = isEffect;
function effect(fn, options) {
    if (options === void 0) { options = shared_1.EMPTY_OBJ; }
    if (isEffect(fn)) {
        fn = fn.raw;
    }
    var effect = createReactiveEffect(fn, options);
    if (!options.lazy) {
        effect();
    }
    return effect;
}
exports.effect = effect;
function stop(effect) {
    if (effect.active) {
        cleanup(effect);
        if (effect.options.onStop) {
            effect.options.onStop();
        }
        effect.active = false;
    }
}
exports.stop = stop;
var uid = 0;
function createReactiveEffect(fn, options) {
    var effect = function reactiveEffect() {
        if (!effect.active) {
            return options.scheduler ? undefined : fn();
        }
        if (!effectStack.includes(effect)) {
            cleanup(effect);
            try {
                enableTracking();
                effectStack.push(effect);
                activeEffect = effect;
                return fn();
            }
            finally {
                effectStack.pop();
                resetTracking();
                activeEffect = effectStack[effectStack.length - 1];
            }
        }
    };
    effect.id = uid++;
    effect._isEffect = true;
    effect.active = true;
    effect.raw = fn;
    effect.deps = [];
    effect.options = options;
    return effect;
}
function cleanup(effect) {
    var deps = effect.deps;
    if (deps.length) {
        for (var i = 0; i < deps.length; i++) {
            deps[i]["delete"](effect);
        }
        deps.length = 0;
    }
}
var shouldTrack = true;
var trackStack = [];
function pauseTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = false;
}
exports.pauseTracking = pauseTracking;
function enableTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = true;
}
exports.enableTracking = enableTracking;
function resetTracking() {
    var last = trackStack.pop();
    shouldTrack = last === undefined ? true : last;
}
exports.resetTracking = resetTracking;
function track(target, type, key) {
    if (!shouldTrack || activeEffect === undefined) {
        return;
    }
    var depsMap = targetMap.get(target);
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()));
    }
    var dep = depsMap.get(key);
    if (!dep) {
        depsMap.set(key, (dep = new Set()));
    }
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect);
        activeEffect.deps.push(dep);
        if (__DEV__ && activeEffect.options.onTrack) {
            activeEffect.options.onTrack({
                effect: activeEffect,
                target: target,
                type: type,
                key: key
            });
        }
    }
}
exports.track = track;
function trigger(target, type, key, newValue, oldValue, oldTarget) {
    var depsMap = targetMap.get(target);
    if (!depsMap) {
        // never been tracked
        return;
    }
    var effects = new Set();
    var add = function (effectsToAdd) {
        if (effectsToAdd) {
            effectsToAdd.forEach(function (effect) { return effects.add(effect); });
        }
    };
    if (type === operations_1.TriggerOpTypes.CLEAR) {
        // collection being cleared
        // trigger all effects for target
        depsMap.forEach(add);
    }
    else if (key === 'length' && shared_1.isArray(target)) {
        depsMap.forEach(function (dep, key) {
            if (key === 'length' || key >= newValue) {
                add(dep);
            }
        });
    }
    else {
        // schedule runs for SET | ADD | DELETE
        if (key !== void 0) {
            add(depsMap.get(key));
        }
        // also run for iteration key on ADD | DELETE | Map.SET
        var shouldTriggerIteration = (type === operations_1.TriggerOpTypes.ADD && (!shared_1.isArray(target) || shared_1.isIntegerKey(key))) ||
            (type === operations_1.TriggerOpTypes.DELETE && !shared_1.isArray(target));
        if (shouldTriggerIteration || (type === operations_1.TriggerOpTypes.SET && target instanceof Map)) {
            add(depsMap.get(shared_1.isArray(target) ? 'length' : exports.ITERATE_KEY));
        }
        if (shouldTriggerIteration && target instanceof Map) {
            add(depsMap.get(exports.MAP_KEY_ITERATE_KEY));
        }
    }
    var run = function (effect) {
        if (__DEV__ && effect.options.onTrigger) {
            effect.options.onTrigger({
                effect: effect,
                target: target,
                key: key,
                type: type,
                newValue: newValue,
                oldValue: oldValue,
                oldTarget: oldTarget
            });
        }
        if (effect.options.scheduler) {
            effect.options.scheduler(effect);
        }
        else {
            effect();
        }
    };
    effects.forEach(run);
}
exports.trigger = trigger;
