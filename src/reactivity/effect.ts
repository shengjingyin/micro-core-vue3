import { extend } from "../shared/index";
class ReactiveEffect {
    private _fn: any;
    deps = [];
    active = true;
    scheduler: any;
    onStop: any;
    constructor(fn, options) {
        // const { scheduler, onStop } = options;
        // this.scheduler = scheduler;
        // this.onStop = onStop;
        extend(this, options);
        this._fn = fn;
    }
    run() {
        activeEffect = this;
        return this._fn();
    }
    stop() {
        if (this.active) {
            cleanupEffect(this);
            if (this.onStop) {
                this.onStop();
            }
            this.active = false;
        }
    }
}
function cleanupEffect(effect: ReactiveEffect) {
    effect.deps.forEach((dep: Set<ReactiveEffect>) => {
        dep.delete(effect);
    });
}
const targetMap = new Map();
// 记录
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
    if (!activeEffect) return;
    // 双向绑定
    dep.add(activeEffect); // dep 关联多少个 响应函数
    activeEffect.deps.push(dep); // 关联函数 对应多少个 dep
}
// 更新
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
    const _effect = new ReactiveEffect(fn, options);

    _effect.run();

    const runner: any = _effect.run.bind(_effect);

    runner.effect = _effect;
    return runner;
}

export function stop(runner) {
    runner.effect.stop();
}
