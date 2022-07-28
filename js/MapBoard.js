class MapBoard {
  constructor(id, ctx, type, mapX, mapY, mapWidth, mapHeight, TILE_SIZE, SIZE_MULT) {
    this.id = id;
    this.ctx = ctx;
    this.type = type;

    this.mapX = mapX;
    this.mapY = mapY;
    this.width = mapWidth;
    this.height = mapHeight;

    this.map = mapCollection[id];
    this.mapGrid = this.map.mapGrid;

    this.image = new Image();
    this.image.src = this.map.imgSrc;

    this.npc = this.loadNpcData(this.map.npcData);

    this.itemList = this.loadDefaultItems(this.map.itemList);
  }

  loadNpcData = function (npcData) {
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

  loadDefaultItems = function (itemList) {
    if (itemList) {
      let items = {};
      for (let key in itemList) {
        if (!itemList[key].pickedUp) {
          items[key] = new Item(itemCollection[key]);
          items[key].mapX = itemList[key].x;
          items[key].mapY = itemList[key].y;
          items[key].pickedUp = itemList[key].pickedUp;
        }
      }
      return items;
    } else {
      return null;
    }
  };

  getGridValue = function (gridXId, gridYId) {
    return this.mapGrid[gridYId][gridXId];
  };

  drawMapItems = function () {
    for (let key in this.itemList) {
      const item = this.itemList[key];
      if (!item.pickedUp) {
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
      }
      this.ctx.restore();
    }
  };

  drawNPC = function () {
    this.ctx.save();
    this.ctx.drawImage(
      this.npc.img,
      this.width / 2 - (TILE_SIZE * SIZE_MULT) / 2,
      this.height / 2 - (TILE_SIZE * SIZE_MULT) / 2,
      TILE_SIZE * SIZE_MULT,
      TILE_SIZE * SIZE_MULT
    );
    this.ctx.restore();
  };

  drawNPCText = function () {
    const metrics = this.ctx.measureText(this.npc.text);
    const textWidth = metrics.width;
    var xPosition = this.width / 2 - textWidth;
    this.ctx.font = "24px status-bar";
    this.ctx.fillStyle = "white";
    this.ctx.fillText(this.npc.text, xPosition, 200);
  };

  draw = function () {
    this.ctx.save();
    this.ctx.drawImage(this.image, 0, 0, this.width, this.height);
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
