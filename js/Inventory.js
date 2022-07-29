class Inventory {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.hearts = new Image();
    this.hearts.src = "img/entities/player_hearts.png";
    this.width = width;
    this.height = height;
    this.itemList = [];
  }

  addItem = function (item) {
    this.itemList.push(item);
  };

  removeItem = function () {};

  drawSword = function () {
    const sword = itemCollection[player.sword.itemId];
    const swordImg = new Image();
    swordImg.src = sword.imgSrc;

    this.ctx.drawImage(
      swordImg,
      (sword.imgCoordinates.x * swordImg.width) / 5,
      sword.imgCoordinates.y,
      swordImg.width / 5,
      swordImg.height,
      515,
      20,
      50,
      70
    );
  };

  drawMainWeapon = function () {
    this.ctx.fillStyle = "#9b9b9b";
    this.ctx.fillRect(500, 8.5, 80, 95);
    this.ctx.fillStyle = "#282828";
    this.ctx.fillRect(510, 13.5, 60, 85);
    if (player.sword) {
      this.drawSword();
    }
  };

  drawEquipedItem = function () {
    this.ctx.fillStyle = "#9b9b9b";
    this.ctx.fillRect(400, 8.5, 80, 95);
    this.ctx.fillStyle = "#282828";
    this.ctx.fillRect(410, 13.5, 60, 85);
    if (player.equipedItem) {
    }
  };

  drawHeartMeter = function (x, y, imgX) {
    const frameWidth = this.hearts.width / 2;
    const imgDimension = (this.hearts.width / 2) * 1.5;

    this.ctx.drawImage(
      this.hearts,
      imgX,
      0,
      frameWidth,
      frameWidth,
      x,
      y,
      imgDimension,
      imgDimension
    );
  };

  drawLifeMeter = function () {
    this.ctx.fillStyle = "#a31a1a";
    this.ctx.fillText("-LIFE-", 740, 35);
    const heartCount = Math.floor(player.hp / 10);
    const halfHeart = player.hp % 10 > 0;
    const heartStartX = 680;
    const imgDimension = (this.hearts.width / 2) * 1.5;
    const frameWidth = this.hearts.width / 2;

    let rowY;
    let positionX;
    for (let i = 0; i < heartCount; i++) {
      if (i < 8) {
        positionX = i * imgDimension + heartStartX;
        rowY = 70;
      } else {
        positionX = (i - 8) * imgDimension + heartStartX;
        rowY = 45;
      }

      this.drawHeartMeter(positionX, rowY, 0);

      if (i === heartCount - 1 && halfHeart) {
        this.drawHeartMeter(positionX + imgDimension, rowY, frameWidth);
      }
    }
  };

  drawBackground = function () {
    this.ctx.fillStyle = "#282828";
    this.ctx.fillRect(0, 0, this.width, this.height);
  };

  draw = function () {
    this.ctx.save();
    this.ctx.font = "25px Arial";
    this.drawBackground();
    this.drawMainWeapon();
    this.drawEquipedItem();
    this.drawLifeMeter();
    this.ctx.restore();
  };

  update = function () {
    this.draw();
  };
}

class Item {
  constructor(item, id) {
    this.id = id;
		this.itemId = item.id;
    this.type = item.type;
		this.tag = item.tag;
    this.name = item.name;
    this.img = new Image();
    this.img.src = item.imgSrc;
    this.imgX = item.imgCoordinates.x;
    this.imgY = item.imgCoordinates.y;
  }
}
