//E8rtJMZ36CZsnQV
const mapCanvas = document.getElementById("mapCanvas");
const ctxMap = mapCanvas.getContext("2d");
ctxMap.font = "30px Arial";
let mapWrapper = document.getElementById("map-wrapper");

const inventoryCanvas = document.getElementById("inventoryCanvas");
const ctxInventory = inventoryCanvas.getContext("2d");
ctxInventory.font = "30px Arial";
const inventoryWrapper = document.getElementById("inventory-wrapper");

const TILE_SIZE = 16;
const MAP_COLUMNS = 16;
const MAP_ROWS = 11;
const SIZE_MULT = 3.5;

const ratio = MAP_COLUMNS / MAP_ROWS;
const MAP_WIDTH = TILE_SIZE * MAP_COLUMNS * SIZE_MULT;
const MAP_HEIGHT = TILE_SIZE * MAP_ROWS * SIZE_MULT;
mapWrapper.style.width = "" + MAP_WIDTH + "px";
mapWrapper.style.height = "" + MAP_WIDTH + "px";

const INV_WIDTH = TILE_SIZE * MAP_COLUMNS * SIZE_MULT;
const INV_HEIGHT = TILE_SIZE * SIZE_MULT * 2;
inventoryWrapper.style.width = "" + INV_WIDTH + "px";
inventoryWrapper.style.height = "" + INV_HEIGHT + "px";

renderCanvas = function () {
  ctxMap.clearRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
  ctxInventory.clearRect(0, 0, INV_WIDTH, INV_HEIGHT);

  mapCanvas.width = MAP_WIDTH;
  mapCanvas.height = MAP_HEIGHT;
  ctxMap.mozImageSmoothingEnabled = false;
  ctxMap.msImageSmoothingEnabled = false;
  ctxMap.imageSmoothingEnabled = false;

  inventoryCanvas.width = INV_WIDTH;
  inventoryCanvas.height = INV_HEIGHT;
  ctxInventory.mozImageSmoothingEnabled = false;
  ctxInventory.msImageSmoothingEnabled = false;
  ctxInventory.imageSmoothingEnabled = false;
};

let mapCollection;
let itemCollection;
let enemyCollection;
const dropItemIdList = ["7", "8", "9", "10"];
let dropItems = {};

let inventory;
let player;
let START_MAP;
let currentMap;

startGame = function () {
  mapCollection = JSON.parse(JSON.stringify(mapData));
  itemCollection = JSON.parse(JSON.stringify(itemData));
  enemyCollection = {};
  dropItems = {};

  for (let key in itemCollection) {
    if (dropItemIdList.includes(key)) {
      dropItems[key] = itemCollection[key];
    }
  }

  inventory = new Inventory(ctxInventory, INV_WIDTH, INV_HEIGHT);
  player = new Player(ctxMap, 60, 5);
  START_MAP = "start_map_001";
  currentMap = new MapBoard(START_MAP, ctxMap, "outerworld", 0, INV_HEIGHT);
};

update = function () {
  renderCanvas();

  const x = player.mapXPos;
  const y = player.mapYPos;
  const w = player.width;
  const h = player.height;
  isMapTransition(x, y, w, h);
  currentMap.update();

  for (let key in enemyCollection) {
    var enemy = enemyCollection[key];

    if (!enemy.toRemove) {
      if (enemy.testCollision(player)) {
        player.processEnemyAttack(enemy);
      }
      if (player.pressingAttack && player.testAttack(enemy)) {
        enemy.hp -= player.attackPower;
        if (enemy.hp <= 0) {
          enemy.onDeath();
        }
      }
      enemy.update();
    } else if (enemy.toRemove && !enemy.doRemove) {
      enemy.update();
    } else if (enemy.doRemove) {
      currentMap.dropItem(enemy);
      delete enemyCollection[key];
    }
  }

  inventory.update();

  player.update();

  validateItemPickup(currentMap, player);
};

startGame();

setInterval(update, 40);
