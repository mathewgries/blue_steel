class Enemy extends Entity {
  constructor(id, canvas, hp, attackPower, xPos, yPos, moveSpd, directionMod, imgSrc) {
    super(id, "enemy", canvas, hp, attackPower, xPos, yPos, moveSpd);
    this.moveSpdX = moveSpd;
    this.moveSpdY = moveSpd;
    this.directionMod = directionMod;
    this.img = new Image();
    this.img.src = imgSrc;

    this.toRemove = false;
    this.doRemove = false;
    this.deathAnimation = null;
    this.deathAnimationCounter = 0;
  }

  setMoveSpeedX = function (val) {
    this.moveSpdX = val;
  };

  getMoveSpeedX = function () {
    return this.moveSpdX;
  };

  setMoveSpeedY = function (val) {
    this.moveSpdY = val;
  };

  getMoveSpeedY = function () {
    return this.moveSpdY;
  };

  setToRemove = function (val) {
    this.toRemove = val;
  };

  getToRemove = function () {
    return this.toRemove;
  };

  setDoRemove = function (val) {
    this.doRemove = val;
  };

  getDoRemove = function () {
    return this.doRemove;
  };

  setDeathAnimation = function (val) {
    this.deathAnimation = new Image();
    this.deathAnimation.src = val;
  };

  getDeathAnimation = function () {
    return this.deathAnimation;
  };

  setDeathAnimationCounter = function (val) {
    this.deathAnimationCounter = val;
  };

  getDeathAnimationCounter = function () {
    return this.deathAnimationCounter;
  };

  onDeath = function () {
    this.setToRemove(true);
    this.setAttackPower(0);
    this.setDeathAnimation("img/entities/enemy_death_animation.png");
  };

  randomDirectionMod = function () {
    return Math.floor(Math.random() * (this.getDirectionMod() - 0 + 1) + 0);
  };

  updatePosition = function () {
    let modChangeX = false;
    let modChangeY = false;
    const x = this.getMapXPos();
    const y = this.getMapYPos();
    const w = this.getWidth();
    const h = this.getHeight();

    modChangeX = this.randomDirectionMod() < this.getDirectionMod() * 0.0125 ? true : false;
    modChangeY = this.randomDirectionMod() < this.getDirectionMod() * 0.0125 ? true : false;

    if (x <= 0 || x >= MAP_WIDTH - w || modChangeX) {
      this.setMoveSpeedX(this.getMoveSpeedX() * -1);
    }

    if (y <= 0 || y >= MAP_HEIGHT - h || modChangeY) {
      this.setMoveSpeedY(this.getMoveSpeedY() * -1);
    }
    this.setMapXPos(x + this.getMoveSpeedX());
    this.setMapYPos(y + this.getMoveSpeedY());
  };

  draw = function () {
    this.getCanvas().getCtx().save();
    const frameWidth = this.img.width / 4;
    const frameHeight = this.img.height;
    const x = this.getMapXPos();
    const y = this.getMapYPos();

    this.getCanvas()
      .getCtx()
      .drawImage(
        this.img,
        this.getWalkingMod() * frameWidth,
        0,
        frameWidth,
        frameHeight,
        x,
        y,
        this.getWidth(),
        this.getHeight()
      );
    this.getCanvas().getCtx().restore();
  };

  drawDeath = function () {
    this.getCanvas().getCtx().save();
    const frameWidth = this.getDeathAnimation().width / 5;
    const frameHeight = this.getDeathAnimation().height / 2;
    let currentFrame = 0;
    const x = this.getMapXPos();
    const y = this.getMapYPos();

    if (this.getDeathAnimationCounter() % 5 === 0) {
      currentFrame += 1;
      if ((currentFrame = 5)) {
        this.setDoRemove(true);
      }
    }

    this.getCanvas()
      .getCtx()
      .drawImage(
        this.getDeathAnimation(),
        currentFrame,
        0,
        frameWidth,
        frameHeight,
        x,
        y,
        this.getWidth(),
        this.getHeight()
      );

    this.getCanvas().getCtx().restore();
  };

  update = function () {
    if (this.getToRemove()) {
      this.setDeathAnimationCounter(this.getDeathAnimationCounter() + 1);
      this.drawDeath();
    } else {
      this.updatePosition();
      this.updateAnimation();
      this.draw();
    }
  };
}

class BlueBat extends Enemy {
	constructor(id, canvas, hp, attackPower, xPos, yPos, moveSpd, directionMod, imgSrc){
		super(id, canvas, hp, attackPower, xPos, yPos, moveSpd, directionMod, imgSrc)
	}
}