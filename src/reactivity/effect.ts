class ReactiveEffect {
    private _fn: any;
    constructor(fn, public scheduler?) {
        this._fn = fn;
    }
    run() {
        activeEffect = this;
        return this._fn();
    }
}
const targetMap = new Map();
export function track(target, key) {
    // 一个实例多个target对象，一个target对象多个属性，每一个属性是只有一个dep, 存储响应函数
    // target（map） - key（map） - dep（set）;
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }

    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }
    dep.add(activeEffect);
}

export function trigger(target, key) {
    const depsMap = targetMap.get(target);
    const dep = depsMap.get(key);
    for (let effect of dep) {
        if (effect.scheduler) {
            effect.scheduler();
        } else {
            effect.run();
        }
    }
}
let activeEffect;
export function effect(fn, options: any = {}) {
    // fn ReactiveEffect
    const { scheduler } = options;
    const _effect = new ReactiveEffect(fn, scheduler);

    _effect.run();

    return _effect.run.bind(_effect);
}
