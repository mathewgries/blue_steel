MapBoard = function (id, WIDTH, HEIGHT, TILE_SIZE, SIZE_MULT) {
  var self = {
    id: id,
    image: new Image(),
  };

  self.map = mapData[id];
  self.mapGrid = self.map.mapGrid;
  self.image.src = self.map.imgSrc;
  self.npc = null;

  self.clearPreviousMapData = function () {
    self.npc = null;
  };

  self.draw = function () {
    ctx.save();
    ctx.drawImage(self.image, 0, 0, WIDTH, HEIGHT);
    if (self.map.npcData) {
      
      ctx.drawImage(
        self.npc,
        WIDTH / 2 - (TILE_SIZE * SIZE_MULT) / 2,
        HEIGHT / 2 - (TILE_SIZE * SIZE_MULT) / 2,
        TILE_SIZE * SIZE_MULT,
        TILE_SIZE * SIZE_MULT
      );
      const metrics = ctx.measureText(self.map.npcData.text);
      const textWidth = metrics.width;
      var xPosition = WIDTH / 2 - textWidth;
      ctx.font = "24px status-bar";
      ctx.fillStyle = "white";
      ctx.fillText(self.map.npcData.text, xPosition, 150);
      
    }
    ctx.restore();
  };

  self.loadOuterWorldMap = function (x, y, w, h) {
    self.clearPreviousMapData();
    let newMapId = "";
    if (x <= 0) {
      newMapId = self.map.mapWest;
      player.mapXPos = WIDTH - w - player.moveSpd;
    } else if (x + w >= WIDTH) {
      newMapId = self.map.mapEast;
      player.mapXPos = 0 + player.moveSpd;
    } else if (y <= 0) {
      newMapId = self.map.mapNorth;
      player.mapYPos = HEIGHT - h - player.moveSpd;
    } else if (y + h >= HEIGHT) {
      newMapId = self.map.mapSouth;
      player.mapYPos = 0 + player.moveSpd;
    }

    self.map = mapData[newMapId];
    self.mapGrid = self.map.mapGrid;
    self.image.src = self.map.imgSrc;
  };

  self.loadCaveMap = function (caveId) {
    self.clearPreviousMapData();
    player.mapXPos = WIDTH / 2 - player.width / 2;
    player.mapYPos = HEIGHT - player.height - player.moveSpd;

    self.map = mapData[caveId];
    self.mapGrid = self.map.mapGrid;
    self.image.src = self.map.imgSrc;
    if (self.map.npcData) {
      const npcData = self.map.npcData;
      self.npc = new Image();
      self.npc.src = npcData.imgSrc;
      const newDiv = document.createElement("div");
      const content = document.createTextNode(self.npc.text);
      const canvas = document.getElementById("canvas");
      newDiv.appendChild(content);
      canvas.appendChild(newDiv);
    }
  };

  self.exitCaveMap = function () {
    const mapId = self.map.caveExit;
    const gridXId = self.map.x;
    const gridYId = self.map.y;
    const exitDirection = self.map.exitDirection;
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

    player.mapXPos = playerX;
    player.mapYPos = playerY;
    self.map = mapData[mapId];
    self.mapGrid = self.map.mapGrid;
    self.image.src = self.map.imgSrc;
  };

  self.getGridValue = function (gridXId, gridYId) {
    return self.mapGrid[gridYId][gridXId];
  };

  self.isOuterWorldMapTransition = function (x, y, w, h) {
    return x <= 0 || x + w >= WIDTH || y <= 0 || y + h >= HEIGHT;
  };

  self.update = function () {
    const playerX = player.mapXPos;
    const playerY = player.mapYPos;
    const playerW = player.width;
    const playerH = player.height;

    if (
      self.map.type === "outerworld" &&
      self.isOuterWorldMapTransition(playerX, playerY, playerW, playerH)
    ) {
      self.loadOuterWorldMap(playerX, playerY, playerW, playerH);
    } else if (self.map.type === "cave") {
      if (player.mapYPos === HEIGHT - player.height) {
        self.exitCaveMap();
      }
    } else if (self.map.hasEntrances) {
      const gridPos = player.getGridPos(playerX, playerY);
      if (self.getGridValue(gridPos.gridXId, gridPos.gridYId) === 3) {
        for (let key in self.map.entrances) {
          const entrance = self.map.entrances[key];
          if (entrance.x === gridPos.gridXId && entrance.y === gridPos.gridYId) {
            self.loadCaveMap(entrance.id);
            break;
          }
        }
      }
    }

    self.draw();
  };
  return self;
};
