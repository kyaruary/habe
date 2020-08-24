// 根据优先级推入队列
export class PriorityList<T> {
  private priorityList: PriorityNode<T>[] = [];

  //  出队
  dequeue() {
    return this.priorityList.shift()!.node;
  }

  // 入队
  enqueue(node: T, priority: number = 0) {
    let flag = false;
    this.priorityList.some((el, index) => {
      if (el.priority > priority) {
        this.priorityList.splice(index, 0, { node, priority });
        return (flag = true);
      }
    });
    !flag && this.priorityList.push({ node, priority });
  }

  // 延迟
  delay() {}

  *[Symbol.iterator]() {
    while (this.priorityList.length !== 0) yield this.dequeue();
  }
}

export type PriorityNode<T> = {
  priority: number;
  node: T;
};
