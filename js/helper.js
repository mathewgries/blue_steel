isMapTransition = function (x, y, w, h) {
  if (currentMap.type === "outerworld") {
    if (isOuterWorldMapTransition(x, y, w, h)) {
      loadOuterWorldMap(x, y, w, h);
    } else if (isCaveMapTransition(x, y)) {
      const gridPos = player.getGridPos(x, y);
      for (let key in currentMap.map.entrances) {
        const entrance = currentMap.map.entrances[key];
        if (entrance.x === gridPos.gridXId && entrance.y === gridPos.gridYId) {
          loadCaveMap(entrance.id);
          break;
        }
      }
    }
  } else if (currentMap.type === "cave") {
    if (isExitCaveMap()) {
      exitCaveMap();
    }
  }
};

isOuterWorldMapTransition = function (x, y, w, h) {
  return x <= 0 || x + w >= MAP_WIDTH || y <= 0 || y + h >= MAP_HEIGHT;
};

loadOuterWorldMap = function (x, y, w, h) {
  enemyCollection = {};
  let newMapId = "";
  if (x <= 0) {
    newMapId = currentMap.map.mapWest;
    player.mapXPos = MAP_WIDTH - w - player.moveSpd;
  } else if (x + w >= MAP_WIDTH) {
    newMapId = currentMap.map.mapEast;
    player.mapXPos = 0 + player.moveSpd;
  } else if (y <= 0) {
    newMapId = currentMap.map.mapNorth;
    player.mapYPos = MAP_HEIGHT - h - player.moveSpd;
  } else if (y + h >= MAP_HEIGHT) {
    newMapId = currentMap.map.mapSouth;
    player.mapYPos = 0 + player.moveSpd;
  }

  if (mapCollection[newMapId].enemydata) {
    loadEnemies(mapCollection[newMapId]);
  }

  currentMap = new OuterworldMap(
    newMapId,
    ctxMap,
    0,
    INV_HEIGHT,
    MAP_WIDTH,
    MAP_HEIGHT,
    TILE_SIZE,
    SIZE_MULT
  );
};

isCaveMapTransition = function (x, y) {
  if (currentMap.map.hasEntrances) {
    const gridPos = player.getGridPos(x, y);
    if (currentMap.getGridValue(gridPos.gridXId, gridPos.gridYId) === 3) {
      return true;
    }
  } else {
    return false;
  }
};

loadCaveMap = function (caveId) {
  enemyCollection = {};
  player.mapXPos = MAP_WIDTH / 2 - player.width / 2;
  player.mapYPos = MAP_HEIGHT - player.height - player.moveSpd;

  currentMap = new CaveMap(
    caveId,
    ctxMap,
    0,
    INV_HEIGHT,
    MAP_WIDTH,
    MAP_HEIGHT,
    TILE_SIZE,
    SIZE_MULT
  );
};

isExitCaveMap = function () {
  if (player.mapYPos === MAP_HEIGHT - player.height) {
    return true;
  } else {
    return false;
  }
};

exitCaveMap = function () {
  enemyCollection = {};
  let newMapId;
  if (currentMap.id === "start_cave" && player.shield && player.sword) {
    newMapId = "river_013";
  } else {
    newMapId = currentMap.map.caveExit;
  }

  const gridXId = currentMap.map.x;
  const gridYId = currentMap.map.y;
  const exitDirection = currentMap.map.exitDirection;
  let playerX;
  let playerY;

  if (exitDirection === "up") {
    playerX = TILE_SIZE * SIZE_MULT * gridXId;
    playerY = TILE_SIZE * SIZE_MULT * gridYId - player.height / 2;
  } else if (exitDirection === "down") {
    playerX = TILE_SIZE * SIZE_MULT * gridXId;
    playerY = TILE_SIZE * SIZE_MULT * gridYId + player.height / 2;
  } else if (exitDirection === "right" || exitDirection === "left") {
    playerX = TILE_SIZE * SIZE_MULT * gridXId;
    playerY = TILE_SIZE * SIZE_MULT * gridYId;
  }

  if (mapCollection[newMapId].enemyData) {
    loadEnemies(mapCollection[newMapId].enemyData);
  }

  currentMap = new OuterworldMap(
    newMapId,
    ctxMap,
    0,
    INV_HEIGHT,
    MAP_WIDTH,
    MAP_HEIGHT,
    TILE_SIZE,
    SIZE_MULT
  );

  player.mapXPos = playerX;
  player.mapYPos = playerY;
};

validateItemPickup = function (currentMap, player) {
  if (currentMap.itemList) {
    const playerCenter = player.getCenterPos();
    for (let key in currentMap.itemList) {
      const item = currentMap.itemList[key];
      if (item.mapX === playerCenter.gridXId && item.mapY === playerCenter.gridYId) {
        const newPlayerItem = new Item(itemCollection[key]);
        inventory.addItem(newPlayerItem);

        if (newPlayerItem.type === "sword") {
          player.sword = newPlayerItem;
          if (!player.attackEnabled) {
            player.enableAttack();
          }
        }

        if (newPlayerItem.type === "shield") {
          if (!player.shield) {
            player.updateCurrentImage(newPlayerItem);
          }
          player.shield = newPlayerItem;
        }

        mapCollection[currentMap.id].itemList[key].pickedUp = true;
        delete currentMap.itemList[key];
        break;
      }
    }
  }
};

loadEnemies = function (enemyList) {
  const mapWidth = TILE_SIZE * SIZE_MULT * MAP_COLUMNS;
  const mapHeight = TILE_SIZE * SIZE_MULT * MAP_ROWS;
  enemyCollection = {};
  let count = 0;
  for (let key in enemyList) {
    for (let i = 0; i < enemyList[key].count; i++) {
      const enemyInfo = enemyData[key];
      const enemy = new Enemy(
        count++,
        ctxMap,
        enemyInfo.attackPower,
        generateXSpawn(mapWidth),
        generateYSpawn(mapHeight),
        enemyInfo.moveSpd,
        enemyInfo.directionMod,
        enemyInfo.imgSrc,
        mapWidth,
        mapHeight,
        TILE_SIZE,
        SIZE_MULT
      );
      enemyCollection[count] = enemy;
    }
  }
};

getDistanceBetweenEntity = function (entiy1, entity2) {
  var vx = entiy1.mapXPos - entity2.mapXPos;
  var vy = entiy1.mapYPos - entity2.mapYPos;

  return Math.sqrt(vx * vx * vy * vy);
};

testCollision = function (entiy1, entity2) {
  var distance = getDistanceBetweenEntity(entiy1, entity2);
  return distance < 30;
};

generateXSpawn = function (mapWidth) {
  return Math.floor(Math.random() * (mapWidth - TILE_SIZE * SIZE_MULT - 1 - 0 + 1) + 0);
};

generateYSpawn = function (mapHeigh) {
  return Math.floor(Math.random() * (mapHeigh - TILE_SIZE * SIZE_MULT - 1 - 0 + 1) + 0);
};
