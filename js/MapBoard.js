class MapBoard {
  constructor(id, ctx, type, mapX, mapY) {
    this.id = id;
    this.ctx = ctx;
    this.type = type;
    this.mapX = mapX;
    this.mapY = mapY;
    this.map = mapCollection[id];
    this.image = new Image();
    this.image.src = this.map.imgSrc;
    this.npc = this.setNpcData(this.map.npcData);
    // this.itemList = this.setDefaultItems(this.map.itemList);
  }

  setId = function (id) {
    this.id = id;
  };

  getId = function () {
    return this.id;
  };

  setCtx = function (ctx) {
    this.ctx = ctx;
  };

  getCtx = function () {
    return this.ctx;
  };

  setType = function (type) {
    this.type = type;
  };

  getType = function () {
    return this.type;
  };

  setMapX = function (x) {
    this.mapX = x;
  };

  getMapX = function () {
    return this.mapX;
  };

  setMapY = function (y) {
    this.mapY = y;
  };

  getMapY = function () {
    return this.mapY;
  };

  setMap = function (id) {
    this.map = mapCollection[id];
  };

  getMap = function () {
    return this.map;
  };

  getMapGrid = function () {
    return this.map.mapGrid;
  };

  getItemDropRating = function () {
    return this.map.itemDropRating;
  };

  getItemDropRate = function () {
    return this.map.itemDropRate;
  };

  getItemData = function () {
    return this.map.itemData;
  };

  checkIsDefaultItem = function (id) {
    let isDefault = false;
    for (let key in this.getItemData()) {
      if (key === id) {
        isDefault = true;
        break;
      }
    }
    return isDefault;
  };

  getNextMapId = function (direction) {
    if (direction.toLowerCase() === "n") {
      return this.map.mapNorth;
    } else if (direction.toLowerCase() === "e") {
      return this.map.mapEast;
    } else if (direction.toLowerCase() === "s") {
      return this.map.mapSouth;
    } else if (direction.toLowerCase() === "w") {
      return this.map.mapWest;
    }
  };

  setMapImg = function (imgSrc) {
    this.image = new Image();
    this.image.src = imgSrc;
  };

  getMapImg = function () {
    return this.image;
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

  getNpcData = function () {
    return this.npc;
  };

  getItemList = function () {
    return this.itemList;
  };

  dropItem = function () {
    if (this.generateItemDropRate()) {
      const selectedRating = this.generateItemSelect();
      for (let key in dropItems) {
        if (dropItems[key].itemRating === selectedRating) {
          return dropItems[key];
          // this.addDropItem(dropItems[key], entity);
          break;
        }
      }
    } else {
      return null;
    }
  };

  generateItemDropRate = function () {
    const dr = Math.floor(Math.random() * (this.getItemDropRate() - 1 + 1) + 1);
    return dr === this.getItemDropRate();
  };

  generateItemSelect = function () {
    const maxProbability = Math.floor(Math.random() * (5 - 1 + 1) + 1);
    if (maxProbability < 5) {
      return Math.floor(Math.random() * (this.getItemDropRating() - 1 + 1) + 1);
    } else {
      return Math.floor(Math.random() * (5 - 1 + 1) + 1);
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
      mapCollection[this.getId()].itemList[item.itemId].pickedUp = true;
    }
  };

  getGridValue = function (gridXId, gridYId) {
    return this.getMapGrid()[gridYId][gridXId];
  };

  drawMapItems = function () {
    const items = this.getItemList();
    for (let key in items) {
      const item = items[key];
      this.getCtx().save();
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
      this.getCtx().restore();
    }
  };

  drawNPC = function () {
    this.getCtx().save();
    this.ctx.drawImage(
      this.getNpcData().img,
      MAP_WIDTH / 2 - (TILE_SIZE * SIZE_MULT) / 2,
      MAP_HEIGHT / 2 - (TILE_SIZE * SIZE_MULT) / 2,
      TILE_SIZE * SIZE_MULT,
      TILE_SIZE * SIZE_MULT
    );
    this.getCtx().restore();
  };

  drawNPCText = function () {
    const metrics = this.getCtx().measureText(this.getNpcData().text);
    const textWidth = metrics.width;
    var xPosition = MAP_WIDTH / 2 - textWidth;
    this.getCtx().font = "24px status-bar";
    this.getCtx().fillStyle = "white";
    this.getCtx().fillText(this.getNpcData().text, xPosition, 200);
  };

  draw = function () {
    this.getCtx().save();
    this.ctx.drawImage(this.getMapImg(), 0, 0, MAP_WIDTH, MAP_HEIGHT);
    if (this.getNpcData()) {
      this.drawNPC();
      this.drawNPCText();
    }
    if (this.itemList) {
      this.drawMapItems();
    }
    this.getCtx().restore();
  };

  update = function () {
    this.draw();
  };
}
