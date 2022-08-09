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
  }

  getCtx = function () {
    return this.ctx;
  };

  setHidden = function (val) {
    let hidden = "";
    let display = "";
    if (val) {
      hidden = "hidden";
      display = "none";
    } else {
      hidden = "visible";
      display = "block";
    }

    this.canvas.style.visibility = hidden;
    this.canvas.style.display = display;

    this.wrapper.style.visibility = hidden;
    this.wrapper.style.display = display;
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
