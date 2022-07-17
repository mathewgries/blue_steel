//E8rtJMZ36CZsnQV
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.font = "30px Arial";

const TILE_SIZE = 16;
const COLUMNS = 16;
const ROWS = 11;
const SIZE_MULT = 3.5;

const ratio = COLUMNS / ROWS;
const WIDTH = TILE_SIZE * COLUMNS * SIZE_MULT;
const HEIGHT = TILE_SIZE * ROWS * SIZE_MULT;

renderCanvas = function () {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  ctx.mozImageSmoothingEnabled = false;
  ctx.msImageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;
};

var player = Player("P", WIDTH, HEIGHT, TILE_SIZE, SIZE_MULT);
var currentMap = MapBoard("001", WIDTH, HEIGHT, TILE_SIZE, SIZE_MULT);

update = function () {
  renderCanvas();
  currentMap.update();
  player.update();
};

// setInterval(update, 40);
