class Player extends Entity {
  constructor(ctx, hp, attackPower) {
    super("player", MAP_WIDTH / 2, MAP_HEIGHT / 2, 7);
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
    this.swordCoord = { x: 0, y: 0 };
    this.attackFrameCounter = 0;
    this.equipedItem = null;
    this.tookDamage = false;
    this.damageCounter = 0;

    this.pressingRight = false;
    this.pressingLeft = false;
    this.pressingDown = false;
    this.pressingUp = false;
    this.pressingAttack = false;
    this.attackRelease = true;
  }

  processEnemyAttack = function (entity) {
    if (!this.tookDamage) {
      this.hp -= entity.attackPower;
      this.tookDamage = true;
      const x = this.mapXPos;
      const y = this.mapYPos;

      if (entity.mapXPos > this.mapXPos) {
        this.moveLeft(x, y);
        entity.updatePosition();
      } else {
        this.moveRight(x, y);
        entity.updatePosition();
      }

      if (entity.mapYPos > this.mapYPos) {
        this.moveUp(x, y);
        entity.updatePosition();
      } else {
        this.moveDown(x, y);
        entity.updatePosition();
      }
    }
  };

  enableAttack = function () {
    this.attackEnabled = true;
  };

  testAttack = function (entity2) {
    //return if colliding (true/false)
    var rect1 = {
      x: this.swordCoord.x - this.width / 2,
      y: this.swordCoord.y - this.height / 2,
      width: this.width,
      height: this.height,
    };
    var rect2 = {
      x: entity2.mapXPos - entity2.width / 2,
      y: entity2.mapYPos - entity2.height / 2,
      width: entity2.width,
      height: entity2.height,
    };
    return testCollisionRectRect(rect1, rect2);
  };

  updateCurrentImage = function (item) {
    if (item.id === "4") {
      this.img.currentImage = this.img.withShield;
    }
  };

  updatePosition = function () {
    if (this.validateKeyPress()) {
      const x = this.mapXPos;
      const y = this.mapYPos;

      if (this.pressingUp) {
        this.moveUp(x, y);
        this.attackMod = 2;
      }

      if (this.pressingDown) {
        this.moveDown(x, y);
        this.attackMod = 1;
      }

      if (this.pressingRight) {
        this.moveRight(x, y);
        this.attackMod = 3;
      }

      if (this.pressingLeft) {
        this.moveLeft(x, y);
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

    if (this.attackMod === 0) {
      this.swordCoord.x = x - TILE_SIZE * SIZE_MULT;
      this.swordCoord.y = y;
    } else if (this.attackMod === 1) {
      this.swordCoord.x = x;
      this.swordCoord.y = y + TILE_SIZE * SIZE_MULT;
    } else if (this.attackMod === 2) {
      this.swordCoord.x = x;
      this.swordCoord.y = y - TILE_SIZE * SIZE_MULT;
    } else if (this.attackMod === 3) {
      this.swordCoord.x = x + TILE_SIZE * SIZE_MULT;
      this.swordCoord.y = y;
    }

    this.ctx.drawImage(
      this.sword.img,
      this.attackMod * frameWidth,
      0,
      frameWidth,
      frameHeight,
      this.swordCoord.x,
      this.swordCoord.y,
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
    if (this.hp <= 0) {
      startGame();
    }
    if (this.tookDamage) {
      this.damageCounter += 1;
      if (this.damageCounter > 5) {
        this.tookDamage = false;
        this.damageCounter = 0;
      }
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
