class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

function buildTree(arr, start = 0, end = arr.length - 1) {
  if (start > end) return null;

  const mid = Math.floor((start + end) / 2);
  const node = new Node(arr[mid]);

  node.left = buildTree(arr, start, mid - 1);
  node.right = buildTree(arr, mid + 1, end);

  return node;
}

class Tree {
  constructor(array) {
    const sortedUnique = [...new Set(array)].sort((a, b) => a - b);
    this.root = buildTree(sortedUnique);
  }

  includes(value) {
    let current = this.root;

    while (current !== null) {
      if (value === current.data) return true;
      current = value < current.data ? current.left : current.right;
    }

    return false;
  }

  insert(value) {
    const newNode = new Node(value);

    if (this.root === null) {
      this.root = newNode;
      return;
    }

    let current = this.root;

    while (true) {
      if (value === current.data) return; // if duplicate, do nothing

      if (value < current.data) {
        if (current.left === null) {
          current.left = newNode;
          return;
        }
        current = current.left;
      } else {
        if (current.right === null) {
          current.right = newNode;
          return;
        }
        current = current.right;
      }
    }
  }

  deleteItem(value) {
    this.root = this.#deleteNode(this.root, value);
  }

  #deleteNode(node, value) {
    if (node === null) return null;

    if (value < node.data) {
      node.left = this.#deleteNode(node.left, value);
      return node;
    }

    if (value > node.data) {
      node.right = this.#deleteNode(node.right, value);
      return node;
    }

    // Found the node to delete
    // Case 1 & 2: zero or one child
    if (node.left === null) return node.right;
    if (node.right === null) return node.left;

    // Case 3: two children -> replace with in order successor
    let successor = node.right;
    while (successor.left !== null) {
      successor = successor.left;
    }

    node.data = successor.data;
    node.right = this.#deleteNode(node.right, successor.data);
    return node;
  }

  levelOrderForEach(callback) {
    if (typeof callback !== "function") {
      throw new Error("levelOrderForEach requires a callback function");
    }

    if (this.root === null) return;

    const queue = [this.root];

    while (queue.length > 0) {
      const node = queue.shift();
      callback(node.data);

      if (node.left !== null) queue.push(node.left);
      if (node.right !== null) queue.push(node.right);
    }
  }

  inOrderForEach(callback) {
    if (typeof callback !== "function") {
      throw new Error("inOrderForEach requires a callback function");
    }
    this.#inOrder(this.root, callback);
  }

  #inOrder(node, callback) {
    if (node === null) return;
    this.#inOrder(node.left, callback);
    callback(node.data);
    this.#inOrder(node.right, callback);
  }

  preOrderForEach(callback) {
    if (typeof callback !== "function") {
      throw new Error("preOrderForEach requires a callback function");
    }
    this.#preOrder(this.root, callback);
  }

  #preOrder(node, callback) {
    if (node === null) return;
    callback(node.data);
    this.#preOrder(node.left, callback);
    this.#preOrder(node.right, callback);
  }

  postOrderForEach(callback) {
    if (typeof callback !== "function") {
      throw new Error("postOrderForEach requires a callback function");
    }
    this.#postOrder(this.root, callback);
  }

  #postOrder(node, callback) {
    if (node === null) return;
    this.#postOrder(node.left, callback);
    this.#postOrder(node.right, callback);
    callback(node.data);
  }

  // height of the node with the given value, undefined if not found
  height(value) {
    const node = this.#findNode(value);
    if (node === null) return undefined;
    return this.#heightOf(node);
  }

  #heightOf(node) {
    if (node === null) return -1; // leaf has height 0
    const left = this.#heightOf(node.left);
    const right = this.#heightOf(node.right);
    return 1 + Math.max(left, right);
  }

  // depth of the node with the given value, undefined if not found
  depth(value) {
    let current = this.root;
    let depth = 0;

    while (current !== null) {
      if (value === current.data) return depth;
      current = value < current.data ? current.left : current.right;
      depth++;
    }

    return undefined;
  }

  isBalanced() {
    return this.#checkBalanced(this.root) !== -1;
  }

  // returns -1 if any subtree is unbalanced, otherwise returns height
  #checkBalanced(node) {
    if (node === null) return 0;

    const left = this.#checkBalanced(node.left);
    if (left === -1) return -1;

    const right = this.#checkBalanced(node.right);
    if (right === -1) return -1;

    if (Math.abs(left - right) > 1) return -1;

    return 1 + Math.max(left, right);
  }

  rebalance() {
    const values = [];
    this.inOrderForEach((v) => values.push(v)); // in order gives sorted values
    this.root = buildTree(values);
  }

  #findNode(value) {
    let current = this.root;
    while (current !== null) {
      if (value === current.data) return current;
      current = value < current.data ? current.left : current.right;
    }
    return null;
  }
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null || node === undefined) return;

  prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
};

// manually testing
const tree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);

prettyPrint(tree.root);

console.log("includes 8:", tree.includes(8));       
console.log("includes 100:", tree.includes(100));   

tree.insert(50);
tree.insert(8); // duplicate, should be ignored

// delete leaf (3), one child, two children (23)
tree.deleteItem(3);
tree.deleteItem(67);
tree.deleteItem(23);
tree.deleteItem(9999); // doesn't exist, no change

prettyPrint(tree.root);

tree.levelOrderForEach((v) => console.log("level:", v));
tree.inOrderForEach((v) => console.log("in:", v));
tree.preOrderForEach((v) => console.log("pre:", v));
tree.postOrderForEach((v) => console.log("post:", v));

// Day 3: height, depth, isBalanced, rebalance
console.log("height of 8:", tree.height(8));
console.log("height of 4:", tree.height(4));
console.log("height of 9999:", tree.height(9999)); // undefined

console.log("depth of 8:", tree.depth(8));
console.log("depth of 4:", tree.depth(4));
console.log("depth of 9999:", tree.depth(9999)); // undefined

console.log("isBalanced?", tree.isBalanced());

// driver script 

function randomArray(size = 15, max = 100) {
  const arr = [];
  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * max));
  }
  return arr;
}

function printOrders(t) {
  const level = [];
  const pre = [];
  const post = [];
  const ino = [];

  t.levelOrderForEach((v) => level.push(v));
  t.preOrderForEach((v) => pre.push(v));
  t.postOrderForEach((v) => post.push(v));
  t.inOrderForEach((v) => ino.push(v));

  console.log("level:", level.join(" "));
  console.log("pre:  ", pre.join(" "));
  console.log("post: ", post.join(" "));
  console.log("in:   ", ino.join(" "));
}

const driverTree = new Tree(randomArray(15, 100));

console.log("balanced?", driverTree.isBalanced());
printOrders(driverTree);

// unbalance by adding values over 100
driverTree.insert(150);
driverTree.insert(200);
driverTree.insert(250);
driverTree.insert(300);
driverTree.insert(400);

console.log("balanced after inserts?", driverTree.isBalanced());
prettyPrint(driverTree.root);

driverTree.rebalance();

console.log("balanced after rebalance?", driverTree.isBalanced());
printOrders(driverTree);
prettyPrint(driverTree.root);