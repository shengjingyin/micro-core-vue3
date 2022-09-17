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
});
