class Canvas {
  constructor(id, cssId, divWrapper, width, height) {
    this.id = id;
    this.canvas = document.getElementById(cssId);
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.font = "30px Arial";
    this.wrapper = document.getElementById(divWrapper);
    this.wrapper.style.width = "" + width + "px";
    this.wrapper.style.height = "" + height + "px";
    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.msImageSmoothingEnabled = false;
    this.ctx.imageSmoothingEnabled = false;
  }

  getCtx = function () {
    return this.ctx;
  };

  update = function () {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.msImageSmoothingEnabled = false;
    this.ctx.imageSmoothingEnabled = false;
  };
}
