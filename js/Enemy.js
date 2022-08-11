class Enemy extends Entity {
  constructor(id, canvas, hp, attackPower, xPos, yPos, moveSpd, changeDirectionMod, imgSrc) {
    super(id, "enemy", canvas, hp, attackPower, xPos, yPos, moveSpd);
    this.changeDirectionMod = changeDirectionMod;
    this.img = new Image();
    this.img.src = imgSrc;

    this.toRemove = false;
    this.doRemove = false;
    this.deathAnimation = null;
    this.deathAnimationCounter = 0;

    this.movingUp = false;
    this.movingDown = false;
    this.movingRight = false;
    this.movingLeft = false;
  }

  getChangeDirectionMod = function () {
    return this.changeDirectionMod;
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

  takeDamage = function (player) {
    this.setHp(this.getHp() - player.getAttackPower());
  };

	damageThrow = function(player){
		
	}

  onDeath = function () {
    this.setToRemove(true);
    this.setAttackPower(0);
    this.setDeathAnimation("img/entities/enemy_death_animation.png");
  };

  setDirection = function () {
    const n = Math.random();
    if (n <= 0.25) {
      this.movingUp = true;
    } else if (n <= 0.5) {
      this.movingDown = true;
    } else if (n <= 0.75) {
      this.movingRight = true;
    } else {
      this.movingLeft = true;
    }
  };

  checkingMoving = function () {
    return this.movingUp || this.movingDown || this.movingRight || this.movingLeft;
  };

  randomChangeDirectionMod = function () {
    return Math.floor(Math.random() * (this.getChangeDirectionMod() - 0 + 1) + 0);
  };

  resetDirections = function () {
    if (this.movingUp) {
      this.movingUp = false;
    } else if (this.movingDown) {
      this.movingDown = false;
    } else if (this.movingRight) {
      this.movingRight = false;
    } else if (this.movingLeft) {
      this.movingLeft = false;
    }
  };

  updatePosition = function () {
    const lastX = this.getMapXPos();
    const lastY = this.getMapYPos();
    const rd = this.randomChangeDirectionMod();
    const modChange = rd < this.getChangeDirectionMod() * 0.0125 ? true : false;

    if (modChange) {
      this.resetDirections();
    } else if (this.movingUp) {
      if (this.getMapYPos() <= 0) {
        this.resetDirections();
      } else {
        this.moveUp();
        if (this.getMapYPos() === lastY) {
          this.resetDirections();
        }
      }
    } else if (this.movingDown) {
      if (this.getMapYPos() >= MAP_HEIGHT - this.getHeight() - this.getMoveSpeed()) {
        this.resetDirections();
      } else {
        this.moveDown();
        if (this.getMapYPos() === lastY) {
          this.resetDirections();
        }
      }
    } else if (this.movingRight) {
      if (this.getMapXPos() >= MAP_WIDTH - this.getWidth()) {
        this.resetDirections();
      } else {
        this.moveRight();
        if (this.getMapXPos() === lastX) {
          this.resetDirections();
        }
      }
    } else if (this.movingLeft) {
      if (this.getMapXPos() <= 0) {
        this.resetDirections();
      } else {
        this.moveLeft();
        if (this.getMapXPos() === lastX) {
          this.resetDirections();
        }
      }
    }
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
    if (!this.checkingMoving()) {
      this.setDirection();
    }
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

//********************************************************************************************** */

class BlueBat extends Enemy {
  constructor(id, canvas, hp, attackPower, xPos, yPos, moveSpd, directionMod, imgSrc) {
    super(id, canvas, hp, attackPower, xPos, yPos, 0, directionMod, imgSrc);
    this.moveSpdX = 0;
    this.moveSpdY = 0;
    this.topMovSped = moveSpd;
    this.moveState = "stopped"; // full, slowing, speedUp, stopped
    this.restartCounter = 0;
    this.animationSpeedControl = 0;
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

  getTopMoveSpeed = function () {
    return this.topMovSped;
  };

  setMoveState = function (val) {
    this.moveState = val;
  };

  getMoveState = function () {
    return this.moveState;
  };

  setRestartCounter = function (val) {
    this.restartCounter = val;
  };

  getRestartCounter = function () {
    return this.restartCounter;
  };

  updateRestartCounter = function () {
    this.setRestartCounter(this.getRestartCounter() + 1);
  };

  setAnimationSpeedControl = function (val) {
    this.animationSpeedControl = val;
  };

  getAnimationSpeedControl = function () {
    return this.animationSpeedControl;
  };

  updateAnimationSpeedControl = function () {
    this.setAnimationSpeedControl(this.getAnimationSpeedControl() + 1);
  };

  generateRandomStop = function () {
    if (Math.random() < 0.1) {
      return Math.random() < 0.1;
    }
    return false;
  };

  updatePosition = function () {
    let modChangeX = false;
    let modChangeY = false;
    const x = this.getMapXPos();
    const y = this.getMapYPos();
    const w = this.getWidth();
    const h = this.getHeight();

    modChangeX =
      this.randomChangeDirectionMod() < this.getChangeDirectionMod() * 0.0125 ? true : false;
    modChangeY =
      this.randomChangeDirectionMod() < this.getChangeDirectionMod() * 0.0125 ? true : false;

    if (x <= 0 || x >= MAP_WIDTH - w || modChangeX) {
      this.setMoveSpeedX(this.getMoveSpeedX() * -1);
    }

    if (y <= 0 || y >= MAP_HEIGHT - h || modChangeY) {
      this.setMoveSpeedY(this.getMoveSpeedY() * -1);
    }
    this.setMapXPos(x + this.getMoveSpeedX());
    this.setMapYPos(y + this.getMoveSpeedY());
  };

  updateAnimationStateControl = function () {
    if (this.getMoveState() === "stopped") {
      this.updateRestartCounter(this.getRestartCounter() + 1);
      if (this.getRestartCounter() === 50) {
        this.setMoveState("speedUp");
        this.setRestartCounter(0);
      }
    } else if (this.getMoveState() === "speedUp") {
      this.updateSpeedUp();
    } else if (this.getMoveState() === "slowing") {
      this.updateSlowDown();
    } else if (this.getMoveState() === "full") {
      if (this.generateRandomStop()) {
        this.setMoveState("slowing");
      }
    }
  };

  updateSpeedUp = function () {
    this.updateAnimationSpeedControl(this.getAnimationSpeedControl() + 1);
    if (this.getAnimationSpeedControl() % 20 === 0) {
      this.setMoveSpeedX(
        this.getMoveSpeedX() >= 0 ? this.getMoveSpeedX() + 1 : this.getMoveSpeedX() - 1
      );
      this.setMoveSpeedY(
        this.getMoveSpeedY() >= 0 ? this.getMoveSpeedY() + 1 : this.getMoveSpeedY() - 1
      );
      if (
        this.getMoveSpeedX() === this.getTopMoveSpeed() ||
        this.getMoveSpeedX() === this.getTopMoveSpeed() * -1
      ) {
        this.setMoveState("full");
        this.setAnimationSpeedControl(0);
      }
    }
  };

  updateSlowDown = function () {
    this.updateAnimationSpeedControl(this.getAnimationSpeedControl() + 1);
    if (this.getAnimationSpeedControl() % 20 === 0) {
      this.setMoveSpeedX(
        this.getMoveSpeedX() > 0 ? this.getMoveSpeedX() - 1 : this.getMoveSpeedX() + 1
      );
      this.setMoveSpeedY(
        this.getMoveSpeedY() > 0 ? this.getMoveSpeedY() - 1 : this.getMoveSpeedY() + 1
      );
      if (this.getMoveSpeedX() === 0) {
        this.setMoveState("stopped");
        this.setAnimationSpeedControl(0);
      }
    }
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

  update = function () {
    if (this.getToRemove()) {
      this.setDeathAnimationCounter(this.getDeathAnimationCounter() + 1);
      this.drawDeath();
    } else if (this.getMoveState() !== "stopped") {
      this.updateAnimationStateControl();
      this.updatePosition();
      this.updateAnimation();
      this.draw();
    } else {
      this.updateAnimationStateControl();
      this.draw();
    }
  };
}

//********************************************************************************************** */

class BlueHog extends Enemy {
  constructor(id, canvas, hp, attackPower, xPos, yPos, moveSpd, directionMod, imgSrc) {
    super(id, canvas, hp, attackPower, xPos, yPos, moveSpd, directionMod, imgSrc);
  }
}

class RedHog extends Enemy {
  constructor(id, canvas, hp, attackPower, xPos, yPos, moveSpd, directionMod, imgSrc) {
    super(id, canvas, hp, attackPower, xPos, yPos, moveSpd, directionMod, imgSrc);
  }
}

//********************************************************************************************** */
