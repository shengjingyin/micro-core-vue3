import { track, trigger } from "./effect";

export function reactive(raw) {
    return new Proxy(raw, {
        get(target, key) {
            const res = Reflect.get(target, key);
            // TODO 依赖监听
            track(target, key);
            return res;
        },
        set(target, key, val) {
            const res = Reflect.set(target, key, val);
            // TODO 依赖更新
            trigger(target, key);
            return res;
        },
    });
}
