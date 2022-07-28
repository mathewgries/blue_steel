class Enemy extends Entity {
  constructor(
    id,
    ctx,
    hp,
    attackPower,
    xPos,
    yPos,
    moveSpd,
    directionMod,
    imgSrc,
    mapWidth,
    mapHeight,
    TILE_SIZE,
    SIZE_MULT
  ) {
    super("enemy", xPos, yPos, moveSpd, mapWidth, mapHeight, TILE_SIZE, SIZE_MULT);
    this.id = id;
    this.hp = hp;
    this.attackPower = attackPower;
    this.ctx = ctx;
    this.img = new Image();
    this.img.src = imgSrc;
    this.deathAnimation = null;
    this.deathAnimationCounter = 0;
    this.moveSpdX = moveSpd;
    this.moveSpdY = moveSpd;
    this.directionMod = directionMod;
    this.toRemove = false;
    this.doRemove = false;
  }

  onDeath = function () {
    this.toRemove = true;
    this.attackPower = 0;
    this.deathAnimation = new Image();
    this.deathAnimation.src = "img/entities/enemy_death_animation.png";
  };

  randomDirectionMod = function () {
    return Math.floor(Math.random() * (this.directionMod - 0 + 1) + 0);
  };

  updatePosition = function () {
    let modChangeX = false;
    let modChangeY = false;

    modChangeX = this.randomDirectionMod() < this.directionMod * 0.0125 ? true : false;
    modChangeY = this.randomDirectionMod() < this.directionMod * 0.0125 ? true : false;

    if (this.mapXPos <= 0 || this.mapXPos >= this.mapWidth - this.width || modChangeX) {
      this.moveSpdX *= -1;
    }

    if (this.mapYPos <= 0 || this.mapYPos >= this.mapHeight - this.height || modChangeY) {
      this.moveSpdY *= -1;
    }
    this.mapXPos += this.moveSpdX;
    this.mapYPos += this.moveSpdY;
  };

  draw = function () {
    this.ctx.save();
    const frameWidth = this.img.width / 4;
    const frameHeight = this.img.height;
    const x = this.mapXPos;
    const y = this.mapYPos;

    this.ctx.drawImage(
      this.img,
      this.walkingMod * frameWidth,
      0,
      frameWidth,
      frameHeight,
      x,
      y,
      this.width,
      this.height
    );
    this.ctx.restore();
  };

  drawDeath = function () {
    this.ctx.save();
    const frameWidth = this.deathAnimation.width / 5;
    const frameHeight = this.deathAnimation.height;
    let currentFrame = 0;
    const x = this.mapXPos;
    const y = this.mapYPos;

    if (this.deathAnimationCounter % 5 === 0) {
      currentFrame += 1;
      if ((currentFrame = 5)) {
        this.doRemove = true;
      }
    }

    this.ctx.drawImage(
      this.deathAnimation,
      currentFrame,
      0,
      frameWidth,
      frameHeight,
      x,
      y,
      this.width,
      this.height
    );

    this.ctx.restore();
  };

  update = function () {
    if (this.toRemove) {
      this.deathAnimationCounter += 1;
      this.drawDeath();
    } else {
      this.updatePosition();
      this.updateAnimation();
      this.draw();
    }
  };
}
