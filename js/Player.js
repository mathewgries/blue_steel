class Player extends Entity {
  constructor(canvas, hp, attackPower) {
    super("player", "player", canvas, hp, attackPower, MAP_WIDTH / 2, MAP_HEIGHT / 2, 7);

    this.img = {};
    this.img.withoutItems = new Image();
    this.img.withoutItems.src = "img/entities/player_no_items.png";
    this.img.withShield = new Image();
    this.img.withShield.src = "img/entities/player_with_shield.png";
    this.img.currentImage = this.img.withoutItems;
    this.img.attack = new Image();
    this.img.attack.src = "img/entities/player_attack.png";

    this.maxHp = 60;
    this.defense = 1;
    this.coinCount = 0;
    this.maxCoinCount = 150;
    this.bombCount = 0;
    this.maxBombCount = 8;

    this.tookDamage = false;
    this.damageCounter = 0;

    this.attackEnabled = false;
    this.pressingAttack = false;
    this.attackRelease = true;

    this.sword = null;
    this.shield = null;
    this.swordCoord = { x: 0, y: 0 };
    this.equipedItem = null;

    this.pressingRight = false;
    this.pressingLeft = false;
    this.pressingDown = false;
    this.pressingUp = false;
  }

  setMaxHp = function (val) {
    this.maxHp = val;
  };

  getMaxHp = function () {
    return this.maxHp;
  };

  setDefense = function (val) {
    this.defense = val;
  };

  getDefense = function () {
    return this.defense;
  };

  setCoinCount = function (val) {
    this.coinCount = val;
  };

  updateCoinCount = function (val) {
    this.coinCount = val;
  };

  getCoinCount = function () {
    return this.coinCount;
  };

  setMaxCoinCount = function (val) {
    this.maxCoinCount = val;
  };

  getMaxCoinCount = function () {
    return this.maxCoinCount;
  };

  setBombCount = function (val) {
    this.bombCount = val;
  };

  updateBombCount = function (val) {
    this.bombCount = val;
  };

  getBombCount = function () {
    return this.bombCount;
  };

  setMaxBombCount = function (val) {
    this.maxBombCount = val;
  };

  getMaxBombCount = function () {
    return this.maxBombCount;
  };

  setTookDamage = function (val) {
    this.tookDamage = val;
  };

  getTookDamage = function () {
    return this.tookDamage;
  };

  setDamageCounter = function (val) {
    this.damageCounter = val;
  };

  getDamageCounter = function () {
    return this.damageCounter;
  };

  setAttackEnabled = function (val) {
    this.attackEnabled = val;
  };

  getAttackEnabled = function () {
    return this.attackEnabled;
  };

  setPressingUp = function (val) {
    this.pressingUp = val;
  };

  getPressingUp = function () {
    return this.pressingUp;
  };

  setPressingDown = function (val) {
    this.pressingDown = val;
  };

  getPressingDown = function () {
    return this.pressingDown;
  };

  setPressingRight = function (val) {
    this.pressingRight = val;
  };

  getPressingRight = function () {
    return this.pressingRight;
  };

  setPressingLeft = function (val) {
    this.pressingLeft = val;
  };

  getPressingLeft = function () {
    return this.pressingLeft;
  };

  setPressingAttack = function (val) {
    this.pressingAttack = val;
    if (val) {
      this.setSwordCoordinates();
    }
  };

  getPressingAttack = function () {
    return this.pressingAttack;
  };

  setAttackRelease = function (val) {
    this.attackRelease = val;
  };

  getAttackRelease = function () {
    return this.attackRelease;
  };

  setSword = function (item) {
    this.sword = {
      itemId: item.itemId,
      img: item.getImg(),
      name: item.getName(),
      tag: item.getTag(),
      type: item.getType(),
      mapXPos: item.getMapXPos(),
      mapYPos: item.getMapYPos(),
      width: item.getWidth(),
      height: item.getHeight(),
    };
    if (!this.getAttackEnabled()) {
      this.setAttackEnabled(true);
    }
  };

  getSword = function () {
    return this.sword;
  };

  setSwordCoordinates = function () {
    const sword = this.getSword();
    const x = this.getMapXPos();
    const y = this.getMapYPos();

    if (this.getAttackMod() === 0) {
      this.getSword().mapXPos = x - TILE_SIZE * SIZE_MULT;
      this.getSword().mapYPos = y;
    } else if (this.getAttackMod() === 1) {
      this.getSword().mapXPos = x;
      this.getSword().mapYPos = y + TILE_SIZE * SIZE_MULT;
    } else if (this.getAttackMod() === 2) {
      this.getSword().mapXPos = x;
      this.getSword().mapYPos = y - TILE_SIZE * SIZE_MULT;
    } else if (this.getAttackMod() === 3) {
      this.getSword().mapXPos = x + TILE_SIZE * SIZE_MULT;
      this.getSword().mapYPos = y;
    }
  };

  setShield = function (item) {
    this.shield = item;
    this.updateCurrentImage();
  };

  getShield = function () {
    return this.shield;
  };

  testAttack = function (entity2) {
    const sword = this.getSword();
    var rect1 = {
      x: sword.mapXPos - this.getWidth() / 2,
      y: sword.mapYPos - this.getHeight() / 2,
      width: sword.width,
      height: sword.height,
    };
    var rect2 = {
      x: entity2.getMapXPos() - entity2.getWidth() / 2,
      y: entity2.getMapYPos() - entity2.getHeight() / 2,
      width: entity2.getWidth(),
      height: entity2.getHeight(),
    };
    return testCollisionRectRect(rect1, rect2);
  };

  processEnemyAttack = function (entity) {
    if (!this.getTookDamage()) {
      this.setHp(this.getHp() - entity.getAttackPower() / this.getDefense());
      this.setTookDamage(true);
      const x = this.getMapXPos();
      const y = this.getMapYPos();

      if (entity.getMapXPos() > x) {
        this.moveLeft(x, y);
        entity.updatePosition();
      } else {
        this.moveRight(x, y);
        entity.updatePosition();
      }

      if (entity.getMapYPos() > y) {
        this.moveUp(x, y);
        entity.updatePosition();
      } else {
        this.moveDown(x, y);
        entity.updatePosition();
      }
    }
  };

  updateCurrentImage = function () {
    this.img.currentImage = this.img.withShield;
  };

  updatePosition = function () {
    if (this.validateKeyPress()) {
      if (this.getPressingUp()) {
        this.moveUp();
        this.setAttackMod(2);
      }

      if (this.getPressingDown()) {
        this.moveDown();
        this.setAttackMod(1);
      }

      if (this.getPressingRight()) {
        this.moveRight();
        this.setAttackMod(3);
      }

      if (this.getPressingLeft()) {
        this.moveLeft();
        this.setAttackMod(0);
      }
    }
  };

  validateKeyPress = function () {
    let valid = true;
    if (this.getPressingUp() && this.getPressingDown()) {
      valid = false;
    } else if (this.getPressingLeft() && this.getPressingRight()) {
      valid = false;
    }
    return valid;
  };

  drawWalking = function () {
    this.getCanvas().getCtx().save();
    const x = this.getMapXPos();
    const y = this.getMapYPos();
    const frameWidth = this.img.currentImage.width / 3;
    const frameHeight = this.img.currentImage.height / 4;

    this.getCanvas()
      .getCtx()
      .drawImage(
        this.img.currentImage,
        this.getWalkingMod() * frameWidth,
        this.getDirectionMod() * frameHeight,
        frameWidth,
        frameHeight,
        x,
        y,
        this.getWidth(),
        this.getHeight()
      );
    this.getCanvas().getCtx().restore();
  };

  drawAttack = function () {
    this.getCanvas().getCtx().save();
    const sword = this.getSword();
    const x = this.getMapXPos();
    const y = this.getMapYPos();
    const frameWidth = this.img.currentImage.width / 4;
    const frameHeight = this.img.currentImage.height;

    this.getCanvas()
      .getCtx()
      .drawImage(
        this.img.currentImage,
        this.getAttackMod() * frameWidth,
        0,
        frameWidth,
        frameHeight,
        x,
        y,
        this.getWidth(),
        this.getHeight()
      );

    this.getCanvas()
      .getCtx()
      .drawImage(
        this.sword.img,
        this.getAttackMod() * frameWidth,
        0,
        frameWidth,
        frameHeight,
        sword.mapXPos,
        sword.mapYPos,
        sword.width,
        sword.height
      );

    this.getCanvas().getCtx().restore();
  };

  update = function () {
    if (this.getHp() <= 0) {
      startGame();
    }
    if (this.getTookDamage()) {
      this.setDamageCounter(this.getDamageCounter() + 1);
      if (this.getDamageCounter() > 5) {
        this.setTookDamage(false);
        this.setDamageCounter(0);
      }
    }
    if (!this.getPressingAttack()) {
      this.updatePosition();
      this.drawWalking();
    } else if (this.getPressingAttack()) {
      this.setAttackFrameCounter(this.getAttackFrameCounter() + 1);
      this.img.currentImage = this.img.attack;
      this.drawAttack();
      if (this.getAttackFrameCounter() > 5) {
        this.setPressingAttack(false);
        this.img.currentImage = this.img.withShield;
        this.setAttackFrameCounter(0);
      }
    } else {
      this.drawWalking();
    }
  };
}
