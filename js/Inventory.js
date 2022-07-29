class Inventory {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.hearts = new Image();
    this.hearts.src = "img/entities/player_hearts.png";
    this.coin = new Image();
    this.coin.src = "img/entities/inventoyItems.png";
    this.width = width;
    this.height = height;
    this.itemList = [];
  }

  addItem = function (item) {
    if (item.tag === "red_rupee") {
      player.coinCount += 1;
    } else if (item.tag === "blue_rupee") {
      player.coinCount += 3;
    } else if (item.tag === "heart") {
      player.hp += 5;
    } else {
      this.itemList.push(item);
    }
  };

  removeItem = function () {};

  drawCoinCount = function () {
    const frameWidth = TILE_SIZE;
    const imgDimension = TILE_SIZE * SIZE_MULT;

    this.ctx.drawImage(
      this.coin,
      1 * TILE_SIZE,
      0,
      frameWidth,
      frameWidth,
      280,
      this.height / 2 - (TILE_SIZE * SIZE_MULT) / 2,
      imgDimension,
      imgDimension
    );
    this.ctx.fillStyle = "white";
    this.ctx.fillText("x", 340, 63);
    this.ctx.fillText(player.coinCount, 360, 65);
  };

  drawEquipedItem = function () {
    this.ctx.fillStyle = "#9b9b9b";
    this.ctx.fillRect(400, 8.5, 80, 95);
    this.ctx.fillStyle = "#282828";
    this.ctx.fillRect(410, 13.5, 60, 85);
    if (player.equipedItem) {
    }
  };

  updateSwordImg = function () {};

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
    const heartStartX = 680;
    const imgDimension = (this.hearts.width / 2) * 1.5;
    const frameWidth = this.hearts.width / 2;
    const heartCount = Math.ceil(player.hp / 20);
    const halfHeart = this.validateHalfHeart();
		// console.log(halfHeart)

      let rowY;
      let positionX;
      for (let i = 0; i < heartCount; i++) {
        if (i < 8) {
					rowY = 70;
          positionX = i * imgDimension + heartStartX;
          
        } else {
					rowY = 45;
          positionX = (i - 8) * imgDimension + heartStartX;
        }

        if (i === heartCount - 1 && halfHeart) {
          this.drawHeartMeter(positionX, rowY, frameWidth);
        } else {
          this.drawHeartMeter(positionX, rowY, 0);
        }
      }
  };

  validateHalfHeart = function () {
    const num = player.hp % 20;
		console.log(num)
    if (num === 0 || num > 10) {
      return false;
    } else {
      return true;
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
    this.drawCoinCount();
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
