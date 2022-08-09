class Equipment {
  constructor(canvas, width, height) {
    this.canvas = canvas;

    this.width = width;
    this.height = height;
  }

  getCanvas = function () {
    return this.canvas;
  };

  getWidth = function () {
    return this.width;
  };

  getHeight = function () {
    return this.height;
  };

	drawBackground = function () {
    this.getCanvas().getCtx().fillStyle = "#282828";
    this.getCanvas().getCtx().fillRect(0, 0, this.width, this.height);
		this.getCanvas().getCtx().fillStyle = "#9b9b9b";
    this.getCanvas().getCtx().fillRect(500, 80, 300, 150);
    this.getCanvas().getCtx().fillStyle = "#282828";
    this.getCanvas().getCtx().fillRect(510, 90, 280, 130);
  };

  draw = function () {
		this.getCanvas().getCtx().save();
		this.drawBackground();
		this.getCanvas().getCtx().restore();
	};

  update = function () {
    this.draw();
  };
}
