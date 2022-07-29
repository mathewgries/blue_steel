class MapBoard {
  constructor(id, ctx, type, mapX, mapY) {
    this.id = id;
    this.ctx = ctx;
    this.type = type;
    this.mapX = mapX;
    this.mapY = mapY;
    this.map = mapCollection[id];
    this.mapGrid = this.map.mapGrid;
    this.itemDropRating = this.map.itemDropRating;
    this.itemDropRate = this.map.itemDropRate;
    this.image = new Image();
    this.image.src = this.map.imgSrc;
    this.npc = this.setNpcData(this.map.npcData);
    this.itemList = this.setDefaultItems(this.map.itemList);
  }

  dropItem = function (entity) {
    if (this.generateItemDropRate()) {
      const enemyIDR = entity.itemDropRating;
      const selectedRating = this.generateItemSelect();
      for (let key in dropItems) {
        if (dropItems[key].itemRating === selectedRating) {
          this.addDropItem(dropItems[key], entity);
          break;
        }
      }
    }
  };

  generateItemDropRate = function () {
    const dr = Math.floor(Math.random() * (this.itemDropRate - 1 + 1) + 1);
    return dr === this.itemDropRate;
  };

  generateItemSelect = function () {
    const maxProbability = Math.floor(Math.random() * (5 - 1 + 1) + 1);
    if (maxProbability < 5) {
      return Math.floor(Math.random() * (this.itemDropRating - 1 + 1) + 1);
    } else {
      return Math.floor(Math.random() * (5 - 1 + 1) + 1);
    }
  };

  setNpcData = function (npcData) {
    if (!npcData) {
      return null;
    } else {
      const img = new Image();
      img.src = npcData.imgSrc;
      return {
        img,
        text: npcData.text,
      };
    }
  };

  generateItemId = function () {
    return Date.now() + Math.floor(Math.random() * (100 - 1 + 1) + 1);
  };

  setDefaultItems = function (itemList) {
    if (itemList) {
      let items = {};
      for (let key in itemList) {
        if (!itemList[key].pickedUp) {
          const id = this.generateItemId();
          items[id] = new Item(itemCollection[key], id);
          items[id].mapX = itemList[key].x;
          items[id].mapY = itemList[key].y;
          items[id].isDefault = true;
        }
      }
      return items;
    } else {
      return {};
    }
  };

  setDefaultItemPickedUp = function (item) {
    if (item.isDefault) {
      mapCollection[currentMap.id].itemList[item.itemId].pickedUp = true;
    }
  };

  addDropItem = function (item, entity) {
    const id = this.generateItemId();
    this.itemList[id] = new Item(item, id);
    this.itemList[id].mapX = Math.floor(entity.mapXPos / (TILE_SIZE * SIZE_MULT));
    this.itemList[id].mapY = Math.floor(entity.mapYPos / (TILE_SIZE * SIZE_MULT));
    this.itemList[id].isDefault = false;
  };

  getGridValue = function (gridXId, gridYId) {
    return this.mapGrid[gridYId][gridXId];
  };

  drawMapItems = function () {
    for (let key in this.itemList) {
      const item = this.itemList[key];
      this.ctx.save();
      const imgDim = TILE_SIZE * SIZE_MULT;

      this.ctx.drawImage(
        item.img,
        item.imgX * TILE_SIZE,
        item.imgY * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE,
        item.mapX * TILE_SIZE * SIZE_MULT,
        item.mapY * TILE_SIZE * SIZE_MULT,
        imgDim,
        imgDim
      );
      this.ctx.restore();
    }
  };

  drawNPC = function () {
    this.ctx.save();
    this.ctx.drawImage(
      this.npc.img,
      MAP_WIDTH / 2 - (TILE_SIZE * SIZE_MULT) / 2,
      MAP_HEIGHT / 2 - (TILE_SIZE * SIZE_MULT) / 2,
      TILE_SIZE * SIZE_MULT,
      TILE_SIZE * SIZE_MULT
    );
    this.ctx.restore();
  };

  drawNPCText = function () {
    const metrics = this.ctx.measureText(this.npc.text);
    const textWidth = metrics.width;
    var xPosition = MAP_WIDTH / 2 - textWidth;
    this.ctx.font = "24px status-bar";
    this.ctx.fillStyle = "white";
    this.ctx.fillText(this.npc.text, xPosition, 200);
  };

  draw = function () {
    this.ctx.save();
    this.ctx.drawImage(this.image, 0, 0, MAP_WIDTH, MAP_HEIGHT);
    if (this.npc) {
      this.drawNPC();
      this.drawNPCText();
    }
    if (this.itemList) {
      this.drawMapItems();
    }
    this.ctx.restore();
  };

  update = function () {
    this.draw();
  };
}
