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