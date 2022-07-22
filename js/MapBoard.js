class MapBoard {
  constructor(id, ctx, mapX, mapY, mapWIdth, mapHeight, TILE_SIZE, SIZE_MULT) {
    this.id = id;
    this.width = mapWIdth;
    this.height = mapHeight;
    this.mapX = mapX;
    this.mapY = mapY;
    this.map = mapData[id];
    this.mapGrid = this.map.mapGrid;
    this.image = new Image();
    this.image.src = this.map.imgSrc;
    this.ctx = ctx;
    this.defaultItems = this.map.defaultItems;
  }

  drawDefaultItems = function () {
    this.ctx.save();
    for (let i = 0; i < this.defaultItems.length; i++) {
      const item = this.defaultItems[i];
			console.log(item)
      // let itemImg = new Image();
      // itemImg.src = item.imgSrc;
      // const imgDim = TILE_SIZE * SIZE_MULT;
      // if (!item.pickedUp) {
      //   this.ctx.drawImage(
      //     itemImg,
      //     imgDim * item.x,
      //     imgDim * item.y,
      //     TILE_SIZE * SIZE_MULT,
      //     TILE_SIZE * SIZE_MULT
      //   );
      // }
    }

    this.ctx.restore();
  };

  draw = function () {
    this.ctx.save();
    this.ctx.drawImage(this.image, this.mapX, this.mapY, this.width, this.height);
    if (this.defaultItems.length > 0) {
      this.drawDefaultItems();
    }
    this.ctx.restore();
  };

  getGridValue = function (gridXId, gridYId) {
    return this.mapGrid[gridYId][gridXId];
  };

  update = function () {
    this.draw();
  };
}
