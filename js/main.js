const canvas = document.getElementById("canvas");

canvas.width = window.innerWidth - 10;
canvas.height = window.innerHeight - 10;

window.onresize = () => {
  canvas.width = window.innerWidth - 10;
  canvas.height = window.innerHeight - 10;
};

function Rect(x, y, width, height, fillStyle) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.fillStyle = fillStyle;
}

const c = canvas.getContext("2d");

c.fillStyle = "rgba(10, 255, 10, 0.5)";

const draw = (el) => {
  c.font = "20px serif";

  c.fillStyle = "rgba(255, 0, 0, 1)";
  c.fillRect(10, 20, 10, 10);
  c.fillText("Left Index", 30, 30);

  c.fillStyle = "rgba(0, 0, 255, 1)";
  c.fillRect(10, 50, 10, 10);
  c.fillText("Right Index", 30, 60);

  c.fillStyle = "rgba(0, 255, 0, 1)";
  c.fillRect(10, 80, 10, 10);
  c.fillText("Last Index", 30, 90);

  // c.fillStyle = "rgba(0, 0, 0, 1)";
  // c.fillText(`FPS: ${Math.round(1000 / deltaTime)}`, 10, 120);

  if (el instanceof Rect) {
    if (
      el.x >= pointer.x - 10 &&
      el.x <= pointer.x &&
      el.y + el.height >= pointer.y &&
      el.y <= pointer.y
    ) {
      c.fillStyle = "rgba(0, 0, 0, 1)";
    } else {
      c.fillStyle = el.fillStyle;
    }

    c.fillRect(el.x, el.y, el.width, el.height);
  }
};

const clear = () => {
  c.clearRect(0, 0, canvas.width, canvas.height);
};

const getRandom = (max) => {
  return Math.round(Math.random() * max);
};

const arr = Array.from({ length: 40 }, () => Math.floor(Math.random() * 40));

const max = Math.max(...arr);
const len = arr.length;

let boxes = arr.map((e, i) => {
  const x = (i * canvas.width) / len + 5;
  const height = (e * canvas.height) / max;
  const y = canvas.height - height;
  const width = 10;
  const fillStyle = `rgba(0, 0, 0, 1)`;

  return new Rect(x, y, width, height, fillStyle);
});

let i = 0;
let j = 0;

let swapI = 0;
let swapJ = 0;
let swapping = false;

const wait = 200;

const swap = (i, j) => {
  swapI = i;
  swapJ = j;
  swapping = true;

  arr[i] = arr[j] + arr[i];
  arr[j] = arr[i] - arr[j];
  arr[i] = arr[i] - arr[j];
};

const interval = setInterval(() => {
  swapping = false;
  if (j + 1 >= arr.length - i) {
    if (i >= arr.length - 1) {
      boxes = arr.map((e, i) => {
        const x = (i * canvas.width) / len + 5;
        const height = (e * canvas.height) / max;
        const y = canvas.height - height;
        const width = 10;
        const fillStyle = `rgba(0, 0, 0, 1)`;

        return new Rect(x, y, width, height, fillStyle);
      });
      clearInterval(interval);
      console.log("Done!");
      return;
    } else {
      i++;
      j = 0;
    }
  }

  boxes = arr.map((e, idx) => {
    const x = (idx * canvas.width) / len + 5;
    const height = (e * canvas.height) / max;
    const y = canvas.height - height;
    const width = 10;
    const fillStyle =
      idx === j
        ? "rgba(255, 0, 0, 1)"
        : idx === j + 1
        ? "rgba(0, 0, 255, 1)"
        : idx === arr.length - i
        ? "rgba(0, 255, 0, 1)"
        : "rgba(0, 0, 0, 0.5)";

    return new Rect(x, y, width, height, fillStyle);
  });

  if (arr[j] > arr[j + 1]) {
    swap(j, j + 1);
  }

  j++;
}, wait);

const swapAnim = () => {
  if (!swapping) {
    return;
  }

  const iX = (swapI * canvas.width) / len + 5;
  const jX = (swapJ * canvas.width) / len + 5;

  const speed = Math.abs(iX - jX) / wait;

  const iBox = boxes[swapI];
  const jBox = boxes[swapJ];

  iBox.x += (deltaTime * speed * (jX - iX)) / Math.abs(iX - jX);
  jBox.x += (deltaTime * speed * (iX - jX)) / Math.abs(iX - jX);
};

const pointer = {
  x: 0,
  y: 0,
  clicked: false,
};

let lastCalledTime;
let deltaTime;

const calculateDeltaTime = () => {
  if (!lastCalledTime) {
    lastCalledTime = performance.now();
  }
  deltaTime = performance.now() - lastCalledTime;
  lastCalledTime = performance.now();
};

const update = () => {
  calculateDeltaTime();

  clear();
  boxes.forEach(draw);
  swapAnim();

  requestAnimationFrame(update);
};

update();

canvas.onmousemove = (e) => {
  pointer.x = e.x;
  pointer.y = e.y;
};

canvas.onmousedown = () => {
  pointer.clicked = true;
};

canvas.onmouseup = () => {
  pointer.clicked = false;
};
