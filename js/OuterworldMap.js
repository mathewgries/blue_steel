class OuterworldMap extends MapBoard {
  constructor(id, ctxMap, MAP_WIDTH, MAP_HEIGHT, TILE_SIZE, SIZE_MULT) {
    super(id, ctxMap, MAP_WIDTH, MAP_HEIGHT, TILE_SIZE, SIZE_MULT);
    this.type = "outerworld";
  }

  // draw = function () {
  //   this.ctx.save();
  //   this.ctx.drawImage(this.image, 0, 0, this.width, this.height);
  //   this.ctx.restore();
  // };

  // update = function () {
  //   this.draw();
  // };
}
