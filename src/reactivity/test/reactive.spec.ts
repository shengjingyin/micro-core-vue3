import { reactive } from "../reactive";
describe("reactive", () => {
    it("happy path", () => {
        const original = { foo: 1 };
        const observed = reactive(original);

        // 做了响应式监听，会有两个特征：
        // 1、original 与 observed 不相等
        expect(original).not.toBe(observed);
        // 2、observed 能监听到 observed 变化
        original.foo++;
        expect(observed.foo).toBe(2);
    });
});
