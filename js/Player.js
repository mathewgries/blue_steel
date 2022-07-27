class Player extends Entity {
  constructor(ctx, hp, attackPower, mapWidth, mapHeight, TILE_SIZE, SIZE_MULT) {
    super("player", mapWidth / 2, mapHeight / 2, 7, mapWidth, mapHeight, TILE_SIZE, SIZE_MULT);
    this.ctx = ctx;
    this.hp = hp;
		this.attackPower = attackPower;
    this.img = {};
    this.img.withoutItems = new Image();
    this.img.withoutItems.src = "img/entities/player_no_items.png";
    this.img.withShield = new Image();
    this.img.withShield.src = "img/entities/player_with_shield.png";
    this.img.currentImage = this.img.withoutItems;
    this.img.attack = new Image();
    this.img.attack.src = "img/entities/player_attack.png";
    this.sword = null;
    this.shield = null;
    this.attackEnabled = false;
    this.attackMod = 0;
    this.attackFrameCounter = 0;
		this.equipedItem = null

    this.pressingRight = false;
    this.pressingLeft = false;
    this.pressingDown = false;
    this.pressingUp = false;
    this.pressingAttack = false;
    this.attackRelease = true;
  }

  enableAttack = function () {
    this.attackEnabled = true;
  };

  updateCurrentImage = function (item) {
    if (item.id === "4") {
      this.img.currentImage = this.img.withShield;
    }
  };

  updatePosition = function () {
    if (this.validateKeyPress()) {
      let nextMapXPos = this.mapXPos;
      let nextMapYPos = this.mapYPos;

      if (this.pressingUp) {
        this.moveUp(nextMapXPos, nextMapYPos);
        this.attackMod = 2;
      }

      if (this.pressingDown) {
        this.moveDown(nextMapXPos, nextMapYPos);
        this.attackMod = 1;
      }

      if (this.pressingRight) {
        this.moveRight(nextMapXPos, nextMapYPos);
        this.attackMod = 3;
      }

      if (this.pressingLeft) {
        this.moveLeft(nextMapXPos, nextMapYPos);
        this.attackMod = 0;
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

  drawWalking = function () {
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

  drawAttack = function () {
    this.ctx.save();
    const x = this.mapXPos;
    const y = this.mapYPos;
    const frameWidth = this.img.currentImage.width / 4;
    const frameHeight = this.img.currentImage.height;
    this.ctx.drawImage(
      this.img.currentImage,
      this.attackMod * frameWidth,
      0,
      frameWidth,
      frameHeight,
      x,
      y,
      this.width,
      this.height
    );

    let nextXGrid;
    let nextYGrid;
    if (this.attackMod === 0) {
      nextXGrid = x - TILE_SIZE * SIZE_MULT;
      nextYGrid = y;
    } else if (this.attackMod === 1) {
      nextXGrid = x;
      nextYGrid = y + TILE_SIZE * SIZE_MULT;
    } else if (this.attackMod === 2) {
      nextXGrid = x;
      nextYGrid = y - TILE_SIZE * SIZE_MULT;
    } else if (this.attackMod === 3) {
      nextXGrid = x + TILE_SIZE * SIZE_MULT;
      nextYGrid = y;
    }
    this.ctx.drawImage(
      this.sword.img,
      this.attackMod * frameWidth,
      0,
      frameWidth,
      frameHeight,
      nextXGrid,
      nextYGrid,
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
		if(this.hp <= 0){
			startGame()
		}
    if (!this.pressingAttack) {
      this.updatePosition();
      this.drawWalking();
    } else if (this.pressingAttack) {
      this.attackFrameCounter += 1;
      this.img.currentImage = this.img.attack;
      this.drawAttack();
      if (this.attackFrameCounter > 5) {
        this.pressingAttack = false;
        this.img.currentImage = this.img.withShield;
        this.attackFrameCounter = 0;
      }
    } else {
      this.drawWalking();
    }
  };
}

document.onkeydown = function (event) {
  if (event.key === "d") {
    player.pressingRight = true;
  } else if (event.key === "s") {
    player.pressingDown = true;
  } else if (event.key === "a") {
    player.pressingLeft = true;
  } else if (event.key === "w") {
    player.pressingUp = true;
  } else if (event.key === "l") {
    if (player.attackEnabled && player.attackRelease) {
      player.attackRelease = false;
      player.pressingAttack = true;
    }
  } else if (event.key === "p") {
    paused = !paused;
  }
};

document.onkeyup = function (event) {
  if (event.key === "d") {
    player.pressingRight = false;
  } else if (event.key === "s") {
    player.pressingDown = false;
  } else if (event.key === "a") {
    player.pressingLeft = false;
  } else if (event.key === "w") {
    player.pressingUp = false;
  } else if (event.key === "l") {
    player.attackRelease = true;
  }
};
