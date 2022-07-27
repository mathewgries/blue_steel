class CaveMap extends MapBoard {
  constructor(id, ctxMap, MAP_WIDTH, MAP_HEIGHT, TILE_SIZE, SIZE_MULT) {
    super(id, ctxMap, MAP_WIDTH, MAP_HEIGHT, TILE_SIZE, SIZE_MULT);
    this.type = "cave";
    this.npc = this.map.npc;
    this.npcImg = new Image();
    this.npcImg.src = this.npc.imgSrc;
    this.npcText = this.npc.text;
  }

  drawNPC = function () {
    this.ctx.save();
    this.ctx.drawImage(
      this.npcImg,
      this.width / 2 - (TILE_SIZE * SIZE_MULT) / 2,
      this.height / 2 - (TILE_SIZE * SIZE_MULT) / 2,
      TILE_SIZE * SIZE_MULT,
      TILE_SIZE * SIZE_MULT
    );
    this.ctx.restore();
  };

  drawNPCText = function () {
    const metrics = this.ctx.measureText(this.npcText);
    const textWidth = metrics.width;
    var xPosition = this.width / 2 - textWidth;
    this.ctx.font = "24px status-bar";
    this.ctx.fillStyle = "white";
    this.ctx.fillText(this.npcText, xPosition, 200);
  };

  draw = function () {
    this.ctx.save();
    this.ctx.drawImage(this.image, 0, 0, this.width, this.height);
    if (this.npc.imgSrc) {
      this.drawNPC();
    }
    if (this.npc.text) {
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
