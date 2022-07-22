class Inventory {
  constructor(ctx, width, height, TILE_SIZE, SIZE_MULT) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.itemList = [];
  }

  addItem = function (item) {
    this.itemList.push(item);
  };

  removeItem = function () {};

  draw = function () {
    this.ctx.save();
    this.ctx.rect(0, 0, this.width, this.height);
    this.ctx.fill();
    this.ctx.restore();
  };

  update = function () {
    this.draw();
  };
}

class Item {
  constructor(id, name, imgX, imgY) {
    this.id = id;
    this.name = name;
    this.img = new Image();
    this.img.src = "img/entities/inventoyItems.png";
    this.imgX = imgX;
    this.imgY = imgY;
  }
}

const woodenSword = new Item(1, "Wooden Sword", 1, 1);
const ironSword = new Item(2, "Iron Sword", 1, 2);
const blueSteel = new Item(3, "Blue Steel", 1, 3);
const woodenShield = new Item(4, "Wooden Shield", 1, 4);
const bombs = new Item(5, "Bomb");
const longBow = new Item(6, "Long Bow");
