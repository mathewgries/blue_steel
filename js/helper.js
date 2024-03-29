generateId = function () {
  return Date.now() + Math.floor(Math.random() * (100 - 1 + 1) + 1);
};

isMapTransition = function (player) {
  const x = player.getMapXPos();
  const y = player.getMapYPos();
  const w = player.getWidth();
  const h = player.getHeight();

  if (currentMap.type === "outerworld") {
    if (isOuterWorldMapTransition(x, y, w, h)) {
      loadOuterWorldMap(player);
    } else if (isCaveMapTransition(player)) {
      const gridPos = player.getGridPos(x, y);

      for (let key in currentMap.getMap().entrances) {
        const entrance = currentMap.getMap().entrances[key];

        if (entrance.x === gridPos.gridXId && entrance.y === gridPos.gridYId) {
          loadCaveMap(entrance.id, player);
          break;
        }
      }
    }
  } else if (currentMap.getType() === "cave") {
    if (isExitCaveMap(player)) {
      exitCaveMap(player);
    }
  }
};

isOuterWorldMapTransition = function (x, y, w, h) {
  return x <= 0 || x + w >= MAP_WIDTH || y <= 0 || y + h >= MAP_HEIGHT;
};

loadOuterWorldMap = function (player) {
  const x = player.getMapXPos();
  const y = player.getMapYPos();
  const w = player.getWidth();
  const h = player.getHeight();
  const m = player.getMoveSpeed();

  let newMapId = "";
  if (x <= 0) {
    newMapId = currentMap.getNextMapId("w");
    player.setMapXPos(MAP_WIDTH - w - m);
  } else if (x + w >= MAP_WIDTH) {
    newMapId = currentMap.getNextMapId("e");
    player.setMapXPos(m);
  } else if (y <= 0) {
    newMapId = currentMap.getNextMapId("n");
    player.setMapYPos(MAP_HEIGHT - h - m);
  } else if (y + h >= MAP_HEIGHT) {
    newMapId = currentMap.getNextMapId("s");
    player.setMapYPos(m);
  }

  prepareMapData(newMapId, player);

  currentMap = new MapBoard(newMapId, mapCanvas, "outerworld", 0, INV_HEIGHT);
};

isCaveMapTransition = function (player) {
  const x = player.getMapXPos();
  const y = player.getMapYPos();
  if (currentMap.getMap().entrances) {
    const gridPos = player.getGridPos(x, y);
    if (currentMap.getGridValue(gridPos.gridXId, gridPos.gridYId) === 3) {
      return true;
    }
  } else {
    return false;
  }
};

loadCaveMap = function (caveId, player) {
  const w = player.getWidth();
  const h = player.getHeight();
  const m = player.getMoveSpeed();

  player.setMapXPos(MAP_WIDTH / 2 - w / 2);
  player.setMapYPos(MAP_HEIGHT - h - m);

  prepareMapData(caveId, player);

  currentMap = new MapBoard(caveId, mapCanvas, "cave", 0, INV_HEIGHT);
};

isExitCaveMap = function (player) {
  if (player.getMapYPos() === MAP_HEIGHT - player.getHeight()) {
    return true;
  } else {
    return false;
  }
};

exitCaveMap = function (player) {
  let newMapId;
  if (currentMap.getId() === "start_cave" && player.shield && player.sword) {
    newMapId = "river_013";
  } else {
    newMapId = currentMap.getMap().caveExit;
  }

  const gridXId = currentMap.getMap().x;
  const gridYId = currentMap.getMap().y;
  const exitDirection = currentMap.getMap().exitDirection;
  let playerX;
  let playerY;

  if (exitDirection === "up") {
    playerX = TILE_SIZE * SIZE_MULT * gridXId;
    playerY = TILE_SIZE * SIZE_MULT * gridYId - player.getHeight() / 2;
  } else if (exitDirection === "down") {
    playerX = TILE_SIZE * SIZE_MULT * gridXId;
    playerY = TILE_SIZE * SIZE_MULT * gridYId + player.getHeight() / 2;
  } else if (exitDirection === "right" || exitDirection === "left") {
    playerX = TILE_SIZE * SIZE_MULT * gridXId;
    playerY = TILE_SIZE * SIZE_MULT * gridYId;
  }

  prepareMapData(newMapId, player);

  currentMap = new MapBoard(newMapId, mapCanvas, "outerworld", 0, INV_HEIGHT);

  player.setMapXPos(playerX);
  player.setMapYPos(playerY);
};

prepareMapData = function (newMapId, player) {
  enemyList = {};
  itemList = {};
  const newMap = mapCollection[newMapId];
  if (newMap.enemyData) {
    loadEnemies(newMap, player);
  }

  if (newMap.itemData) {
    loadItems(newMap.itemData);
  }
};

loadEnemies = function (newMap, player) {
  enemyList = {};
  const enemies = newMap.enemyData;

  for (let key in enemies) {
    for (let i = 0; i < enemies[key].count; i++) {
      enemySelector(key, player, newMap.mapGrid);
    }
  }
};

enemySelector = function (key, player, mapGrid) {
  const id = generateId();
  let enemy;
  const enemyInfo = enemyCollection[key];
  if (key === "1") {
    const pos = generateSpawnPosAny(player);
    enemy = new BlueBat(
      id,
      mapCanvas,
      enemyInfo.hp,
      enemyInfo.attackPower,
      pos.x,
      pos.y,
      enemyInfo.moveSpd,
      enemyInfo.changeDirectionMod,
      enemyInfo.imgSrc
    );
  } else if (key === "2") {
    const pos = generateSpawnNonWall(player, mapGrid);
    enemy = new BlueHog(
      id,
      mapCanvas,
      enemyInfo.hp,
      enemyInfo.attackPower,
      pos.x,
      pos.y,
      enemyInfo.moveSpd,
      enemyInfo.changeDirectionMod,
      enemyInfo.imgSrc
    );
  } else if (key === "3") {
    const pos = generateSpawnNonWall(player, mapGrid);
    enemy = new RedHog(
      id,
      mapCanvas,
      enemyInfo.hp,
      enemyInfo.attackPower,
      pos.x,
      pos.y,
      enemyInfo.moveSpd,
      enemyInfo.changeDirectionMod,
      enemyInfo.imgSrc
    );
  }
  enemyList[id] = enemy;
};

loadItems = function (items) {
  itemList = {};
  for (let key in items) {
    if (!items[key].pickedUp) {
      const itemInfo = itemCollection[key];
      const id = generateId();
      const item = new Item(
        id,
        itemInfo,
        mapCanvas,
        getMapPosId(items[key].x),
        getMapPosId(items[key].y)
      );
      itemList[id] = item;
    }
  }
};

dropItem = function (newItem, enemy) {
  const id = generateId();
  const item = new Item(id, newItem, mapCanvas, enemy.getMapXPos(), enemy.getMapYPos());
  itemList[id] = item;
};

testCollisionRectRect = function (rect1, rect2) {
  return (
    rect1.x <= rect2.x + rect2.width &&
    rect2.x <= rect1.x + rect1.width &&
    rect1.y <= rect2.y + rect2.height &&
    rect2.y <= rect1.y + rect1.height
  );
};

getMapPosId = function (gridPos) {
  return gridPos * TILE_SIZE * SIZE_MULT;
};

generateSpawnPosAny = function (player) {
  let x;
  let y;
  const pX = player.getMapXPos();
  const pY = player.getMapYPos();
  const minDistance = TILE_SIZE * SIZE_MULT * 5;

  do {
    x = Math.floor(Math.random() * (MAP_WIDTH - TILE_SIZE * SIZE_MULT - 1 - 0 + 1) + 0);
  } while (Math.abs(pX - x) < minDistance);
  do {
    y = Math.floor(Math.random() * (MAP_HEIGHT - TILE_SIZE * SIZE_MULT - 1 - 0 + 1) + 0);
  } while (Math.abs(pY - y) < minDistance);

  return { x, y };
};

generateSpawnNonWall = function (player, mapGrid) {
  let x;
  let y;
  const pX = player.getMapXPos();
  const pY = player.getMapYPos();
  const minDistance = TILE_SIZE * SIZE_MULT * 5;
  let xId;
  let yId;

  do {
    do {
      x = Math.floor(Math.random() * (MAP_WIDTH - TILE_SIZE * SIZE_MULT - 1 - 0 + 1) + 0);
      x = x - (x % (TILE_SIZE * SIZE_MULT));
    } while (Math.abs(pX - x) < minDistance);

    do {
      y = Math.floor(Math.random() * (MAP_HEIGHT - TILE_SIZE * SIZE_MULT - 1 - 0 + 1) + 0);
      y = y - (y % (TILE_SIZE * SIZE_MULT));
    } while (Math.abs(pY - y) < minDistance);

    xId = Math.floor(x / (TILE_SIZE * SIZE_MULT));
    yId = Math.floor(y / (TILE_SIZE * SIZE_MULT));
  } while (mapGrid[yId][xId] !== 2);

  return { x, y };
};
