const canvas = document.getElementById('drawing-board');
const ctx = canvas.getContext('2d');
let painting = false;
let brushSize = 5;
let brushColor = '#000000';

function startPosition(e) {
  painting = true;
  draw(e);
}

function finishedPosition() {
  painting = false;
  ctx.beginPath();
}

function draw(e) {
  if (!painting) return;
  ctx.lineWidth = brushSize;
  ctx.lineCap = 'round';
  ctx.strokeStyle = brushColor;

  ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
}

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', finishedPosition);
canvas.addEventListener('mousemove', draw);

document.querySelectorAll('.color-picker').forEach(item => {
  item.addEventListener('click', function() {
    brushColor = this.getAttribute('data-color');
  });
});

document.querySelectorAll('.size-picker').forEach(item => {
  item.addEventListener('click', function() {
    brushSize = this.getAttribute('data-size');
  });
});
