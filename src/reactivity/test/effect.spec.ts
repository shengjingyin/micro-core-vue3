import { reactive } from "../reactive";
import { effect } from "../effect";
describe("effect", () => {
    it("happy path", () => {
        const user = reactive({
            age: 10,
        });
        let nextAge;
        effect(() => {
            nextAge = user.age + 1;
        });
        expect(nextAge).toBe(11); // 说明effect 会立即调用

        // update
        user.age++;
        expect(nextAge).toBe(12); // 说明user.age++ 做了响应式更新，触发了 effect中的函数
    });

    it("should return runner when call effect", () => {
        let foo = 10;
        const runner = effect(() => {
            foo++;
            return "foo";
        });

        expect(foo).toBe(11);
        const r = runner();
        expect(r).toBe("foo");
    });

    it(" scheduler", () => {
        let dummy;
        let run: any;
        const scheduler = jest.fn(() => {
            run = runner;
        });
        const obj = reactive({ foo: 1 });
        const runner = effect(
            () => {
                dummy = obj.foo;
            },
            { scheduler }
        );
        // 初始状态执行参数fn，不执行scheduler
        expect(scheduler).not.toBeCalled();
        expect(dummy).toBe(1);
        // should be called on first trigger
        obj.foo++;
        // 更新数据时，执行一次scheduler
        expect(scheduler).toHaveBeenCalledTimes(1);
        //  should not run yet
        expect(dummy).toBe(1);
        // manually run
        // 执行一次fn
        run();
        // l should have run
        expect(dummy).toBe(2);
    });
});
