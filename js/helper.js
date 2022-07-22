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
  const newMapId = currentMap.map.caveExit;
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
