class Inventory {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.hearts = new Image();
    this.hearts.src = "img/entities/player_hearts.png";
    this.coin = new Image();
    this.coin.src = "img/entities/inventoyItems.png";
    this.bomb = new Image();
    this.bomb.src = "img/entities/inventoyItems.png";
    this.width = width;
    this.height = height;
    this.itemList = [];
  }

  addItem = function (item, player) {
    if (item.getType() === "rupee") {
      this.addRupee(item, player);
    } else if (item.getType() === "heart") {
      this.addHeart(player);
    } else if (item.getType() === "bomb") {
      this.addBomb(player);
    } else if (item.getType() === "shield") {
      this.addShield(item, player);
    } else if (item.getType() === "sword") {
      this.addSword(item, player);
    }
  };

  addRupee = function (item, player) {
    const tag = item.getTag();
    let count = player.getCoinCount();
    const max = player.getMaxCoinCount();

    if (count < max) {
      if (tag === "red_rupee") {
        count += 1;
      } else if (tag === "blue_rupee") {
        count += 3;
      }

      if (count >= max) {
        player.updateCoinCount(max);
      } else {
        player.updateCoinCount(count);
      }
    }
  };

  addHeart = function (player) {
    let hp = player.getHp();
    const max = player.getMaxHp();

    if (hp < max) {
      hp += 20;
      player.updateHp(hp + 20);
    }

    if (hp >= max) {
      player.updateHp(max);
    } else {
      player.updateHp(hp);
    }
  };

  addBomb = function (player) {
    let count = player.getBombCount();
    const max = player.getMaxBombCount();

    if (count < max) {
      count += 4;
    }

    if (count >= max) {
      player.updateBombCount(max);
    } else {
      player.updateBombCount(count);
    }
  };

  addShield = function (item, player) {
    player.setShield(item);
  };

  addSword = function (item, player) {
    player.setSword(item);
    // itemList[item.itemId].pickedUp = true;
  };

  removeItem = function () {};

  drawBombCount = function () {
    const frameWidth = TILE_SIZE;
    const imgDimension = TILE_SIZE * SIZE_MULT;

    this.ctx.drawImage(
      this.bomb,
      0 * TILE_SIZE,
      TILE_SIZE,
      frameWidth,
      frameWidth,
      243,
      this.height / 2 - (TILE_SIZE * SIZE_MULT) / 2,
      imgDimension,
      imgDimension
    );
    this.ctx.fillStyle = "white";
    this.ctx.fillText("x", 300, 63);
    this.ctx.fillText(player.bombCount, 320, 65);
  };

  drawCoinCount = function () {
    const frameWidth = TILE_SIZE;
    const imgDimension = TILE_SIZE * SIZE_MULT;

    this.ctx.drawImage(
      this.coin,
      1 * TILE_SIZE,
      TILE_SIZE,
      frameWidth,
      frameWidth,
      340,
      this.height / 2 - (TILE_SIZE * SIZE_MULT) / 2,
      imgDimension,
      imgDimension
    );
    this.ctx.fillStyle = "white";
    this.ctx.fillText("x", 390, 63);
    this.ctx.fillText(player.coinCount, 410, 65);
  };

  drawEquipedItem = function () {
    this.ctx.fillStyle = "#9b9b9b";
    this.ctx.fillRect(450, 8.5, 80, 95);
    this.ctx.fillStyle = "#282828";
    this.ctx.fillRect(460, 13.5, 60, 85);
    if (player.equipedItem) {
    }
  };

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
      565,
      20,
      50,
      70
    );
  };

  drawMainWeapon = function () {
    this.ctx.fillStyle = "#9b9b9b";
    this.ctx.fillRect(550, 8.5, 80, 95);
    this.ctx.fillStyle = "#282828";
    this.ctx.fillRect(560, 13.5, 60, 85);
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
    this.drawBombCount();
    this.ctx.restore();
  };

  update = function () {
    this.draw();
  };
}

class Item {
  constructor(id, item, ctx, xPos, yPos) {
    this.id = id;
    this.itemId = item.id;
    this.ctx = ctx;
    this.type = item.type;
    this.tag = item.tag;
    this.name = item.name;
    this.img = new Image();
    this.img.src = item.imgSrc;
    this.img.dim = TILE_SIZE * SIZE_MULT * item.scale;
    this.width = TILE_SIZE * SIZE_MULT * item.scale;
    this.height = TILE_SIZE * SIZE_MULT * item.scale;
    this.imgX = item.imgCoordinates.x;
    this.imgY = item.imgCoordinates.y;

    this.mapXPos = xPos;
    this.mapYPos = yPos;

    this.toRemove = false;
  }

  getId = function () {
    return this.id;
  };

  getItemId = function () {
    return this.itemId;
  };

  getCtx = function () {
    return this.ctx;
  };

  getTag = function () {
    return this.tag;
  };

  getName = function () {
    return this.name;
  };

  getType = function () {
    return this.type;
  };

  getImg = function () {
    return this.img;
  };

  getWidth = function () {
    return this.width;
  };

  getHeight = function () {
    return this.height;
  };

  getImgX = function () {
    return this.imgX;
  };

  getImgY = function () {
    return this.imgY;
  };

  getMapXPos = function () {
    return this.mapXPos;
  };

  getMapYPos = function () {
    return this.mapYPos;
  };

  setToRemove = function (val) {
    this.toRemove = val;
  };

  getToRemove = function () {
    return this.toRemove;
  };

  draw = function () {
    this.getCtx().save();

    this.ctx.drawImage(
      this.getImg(),
      this.getImgX() * TILE_SIZE,
      this.getImgY() * TILE_SIZE,
      TILE_SIZE,
      TILE_SIZE,
      this.getMapXPos(),
      this.getMapYPos(),
      this.getWidth(),
      this.getHeight()
    );
    this.getCtx().restore();
  };

  update = function () {
    this.draw();
  };
}
