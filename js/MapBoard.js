class MapBoard {
  constructor(id, ctx, mapX, mapY, mapWidth, mapHeight, TILE_SIZE, SIZE_MULT) {
    this.id = id;
    this.width = mapWidth;
    this.height = mapHeight;
    this.mapX = mapX;
    this.mapY = mapY;
    this.map = mapCollection[id];
    this.mapGrid = this.map.mapGrid;
    this.image = new Image();
    this.image.src = this.map.imgSrc;
    this.ctx = ctx;
    this.itemList = this.loadDefaultItems(this.map.itemList);
  }

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

  draw = function () {
    this.ctx.save();
    this.ctx.drawImage(this.image, 0, 0, this.width, this.height);
    if (this.itemList) {
      this.drawMapItems();
    }
    this.ctx.restore();
  };

  update = function () {
    this.draw();
  };
}
