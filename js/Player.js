class Player extends Entity {
  constructor(ctx, inventory, mapWidth, mapHeight, TILE_SIZE, SIZE_MULT) {
    super(mapWidth / 2, mapHeight / 2, 7, mapWidth, mapHeight, TILE_SIZE, SIZE_MULT);
    this.ctx = ctx;
    this.inventory = new Inventory();
    this.img = {};
    this.img.withoutItems = new Image();
    this.img.withoutItems.src = "img/entities/player_no_items.png";
    this.img.withShield = new Image();
    this.img.withShield.src = "img/entities/player_with_shield.png";
    this.img.currentImage = this.img.withoutItems;
    this.inventory = inventory;

    this.pressingRight = false;
    this.pressingLeft = false;
    this.pressingDown = false;
    this.pressingUp = false;
  }

  updatePosition = function () {
    if (this.validateKeyPress()) {
      let nextMapXPos = this.mapXPos;
      let nextMapYPos = this.mapYPos;

      if (this.pressingUp) {
        this.moveUp(nextMapXPos, nextMapYPos);
      }

      if (this.pressingDown) {
        this.moveDown(nextMapXPos, nextMapYPos);
      }

      if (this.pressingRight) {
        this.moveRight(nextMapXPos, nextMapYPos);
      }

      if (this.pressingLeft) {
        this.moveLeft(nextMapXPos, nextMapYPos);
      }
    }
  };

  validateKeyPress = function () {
    let valid = true;
    if (this.pressingUp && this.pressingDown) {
      valid = false;
    } else if (this.pressingLeft && this.pressingRight) {
      valid = false;
    }
    return valid;
  };

  draw = function () {
    this.ctx.save();
    const x = this.mapXPos;
    const y = this.mapYPos;
    const frameWidth = this.img.currentImage.width / 3;
    const frameHeight = this.img.currentImage.height / 4;
    this.ctx.drawImage(
      this.img.currentImage,
      this.walkingMod * frameWidth,
      this.directionMod * frameHeight,
      frameWidth,
      frameHeight,
      x,
      y,
      this.width,
      this.height
    );
    this.ctx.restore();
  };

  updateAnimation = function () {
    this.animationCounter += 0.5;
    this.walkingMod = Math.floor(this.animationCounter) % 3;
  };

  update = function () {
    if (this.pressingDown || this.pressingUp || this.pressingRight || this.pressingLeft) {
      this.updatePosition();
    }

    this.draw();
  };
}

document.onkeydown = function (event) {
  if (event.key === "d") {
    //d
    player.pressingRight = true;
  } else if (event.key === "s") {
    //s
    player.pressingDown = true;
  } else if (event.key === "a") {
    //a
    player.pressingLeft = true;
  } else if (event.key === "w") {
    // w
    player.pressingUp = true;
  } else if (event.key === "p") {
    //p
    paused = !paused;
  }
};

document.onkeyup = function (event) {
  if (event.key === "d") {
    //d
    player.pressingRight = false;
  } else if (event.key === "s") {
    //s
    player.pressingDown = false;
  } else if (event.key === "a") {
    //a
    player.pressingLeft = false;
  } else if (event.key === "w") {
    // w
    player.pressingUp = false;
  }
};
