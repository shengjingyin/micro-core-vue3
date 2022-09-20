let dep: Number | null = null;
/**
 * 返回具体的层级
 * @param {}  -
 * @returns {}
 */
export function findEleDepth(tree, id, int = 1) {
  if (tree.id == id) {
    return dep = int;
  }
  if (!tree.children) {
    return false;
  }
  for (let i = 0; i < tree.children.length; i++) {
    const depth = findEleDepth(tree.children[i], id, int + 1)
    if (depth) {
      return depth;
    }
  }
  return false;
}
