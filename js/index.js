//E8rtJMZ36CZsnQV
const TILE_SIZE = 16;
const MAP_COLUMNS = 16;
const MAP_ROWS = 11;
const SIZE_MULT = 3.5;

const ratio = MAP_COLUMNS / MAP_ROWS;
const MAP_WIDTH = TILE_SIZE * MAP_COLUMNS * SIZE_MULT;
const MAP_HEIGHT = TILE_SIZE * MAP_ROWS * SIZE_MULT;

const INV_WIDTH = TILE_SIZE * MAP_COLUMNS * SIZE_MULT;
const INV_HEIGHT = TILE_SIZE * SIZE_MULT * 2;

let mapCollection;
let itemCollection;
let enemyCollection;

let itemList;
let enemyList;
const dropItemIdList = ["7", "8", "9", "10"];
let dropItems = {};

let mapCanvas;
let inventoryCanvas;
let inventory;
let player;
let START_MAP;
let currentMap;

renderCanvas = function () {
  for (let key in canvasList) {
    canvasList[key].update();
  }
};

startGame = function () {
  mapCollection = JSON.parse(JSON.stringify(mapData));
  itemCollection = JSON.parse(JSON.stringify(itemData));
  enemyCollection = JSON.parse(JSON.stringify(enemyData));
  canvasList = {};
  itemList = {};
  enemyList = {};
  dropItems = {};

  for (let key in itemCollection) {
    if (dropItemIdList.includes(key)) {
      dropItems[key] = itemCollection[key];
    }
  }

  mapCanvas = new Canvas("map", "mapCanvas", "map-wrapper", MAP_WIDTH, MAP_HEIGHT);
  inventoryCanvas = new Canvas(
    "inventory",
    "inventoryCanvas",
    "inventory-wrapper",
    INV_WIDTH,
    INV_HEIGHT
  );
  canvasList["map"] = mapCanvas;
  canvasList["inventory"] = inventoryCanvas;

  inventory = new Inventory(inventoryCanvas, INV_WIDTH, INV_HEIGHT);
  player = new Player(mapCanvas, 60, 5);
  START_MAP = "start_map_001";
  currentMap = new MapBoard(START_MAP, mapCanvas, "outerworld", 0, INV_HEIGHT);
};

update = function () {
  renderCanvas();

  isMapTransition(player);
  currentMap.update();

  for (let key in enemyList) {
    var enemy = enemyList[key];

    if (!enemy.getToRemove()) {
      if (enemy.testCollision(player)) {
        player.processEnemyAttack(enemy);
      }
      if (player.pressingAttack && player.testAttack(enemy)) {
        enemy.setHp(enemy.hp - player.attackPower);
        if (enemy.hp <= 0) {
          enemy.onDeath();
        }
      }
      enemy.update();
    } else if (enemy.getToRemove() && !enemy.getDoRemove()) {
      enemy.update();
    } else if (enemy.getDoRemove()) {
      const newItem = currentMap.dropItem(enemy);
      if (newItem) {
        dropItem(newItem, enemy);
      }
      delete enemyList[key];
    }
  }

  for (let key in itemList) {
    var item = itemList[key];
    if (player.testCollision(item)) {
      inventory.addItem(item, player);
      item.setToRemove(true);
    }
    if (player.getPressingAttack()) {
      if (player.testAttack(item)) {
        inventory.addItem(item, player);
        item.setToRemove(true);
      }
    }
    if (item.getToRemove()) {
      if (currentMap.checkIsDefaultItem(item.itemId)) {
        currentMap.getItemData()[item.itemId].pickedUp = true;
      }

      delete itemList[key];
    } else {
      item.update();
    }
  }

  inventory.update();

  player.update();
};

startGame();

setInterval(update, 40);
