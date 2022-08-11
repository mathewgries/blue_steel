class Entity {
  constructor(id, type, canvas, hp, attackPower, xPos, yPos, moveSpd) {
    this.id = id;
    this.type = type;
    this.canvas = canvas;
    this.hp = hp;
    this.attackPower = attackPower;
    this.mapXPos = xPos;
    this.mapYPos = yPos;
    this.moveSpd = moveSpd;

    this.width = TILE_SIZE * SIZE_MULT;
    this.height = TILE_SIZE * SIZE_MULT;

    this.directionMod = 2;
    this.animationCounter = 0;
    this.walkingMod = 1;

    this.attackMod = 0;
    this.attackFrameCounter = 0;
  }

  getId = function () {
    return this.id;
  };

  setHp = function (val) {
    this.hp = val;
  };

  updateHp = function (val) {
    this.hp = val;
  };

  getHp = function () {
    return this.hp;
  };

  setAttackPower = function (val) {
    this.attackPower = val;
  };

  getAttackPower = function () {
    return this.attackPower;
  };

  getType = function () {
    return this.type;
  };

  getCanvas = function () {
    return this.canvas;
  };

  setMapXPos = function (x) {
    this.mapXPos = x;
  };

  getMapXPos = function () {
    return this.mapXPos;
  };

  setMapYPos = function (y) {
    this.mapYPos = y;
  };

  getMapYPos = function () {
    return this.mapYPos;
  };

  getWidth = function () {
    return this.width;
  };

  getHeight = function () {
    return this.height;
  };

  getMoveSpeed = function () {
    return this.moveSpd;
  };

  setDirectionMod = function (num) {
    this.directionMod = num;
  };

  getDirectionMod = function () {
    return this.directionMod;
  };

  setAnimationCounter = function (val) {
    this.animationCounter = val;
  };

  getAnimationCounter = function () {
    return this.animationCounter;
  };

  setWalkingMod = function (num) {
    this.walkingMod = num;
  };

  getWalkingMod = function () {
    return this.walkingMod;
  };

  setAttackMod = function (val) {
    this.attackMod = val;
  };

  getAttackMod = function () {
    return this.attackMod;
  };

  setAttackFrameCounter = function (val) {
    this.attackFrameCounter = val;
  };

  getAttackFrameCounter = function () {
    return this.attackFrameCounter;
  };

  getCenterPos = function () {
    const w = this.getWidth();
    const h = this.getHeight();
    return {
      gridXId: Math.floor((this.getMapXPos() + w / 2) / w),
      gridYId: Math.floor((this.getMapYPos() + h / 2) / h),
    };
  };

  getGridPos = function (x, y) {
    const w = this.getWidth();
    const h = this.getHeight();
    return {
      gridXId: Math.floor(x / w),
      gridYId: Math.floor((y + h / 2) / h),
      gridXPos: x % w,
      gridYPos: (y + h / 2) % h,
    };
  };

  getTopLeftBumber = function (mapXPos, mapYPos) {
    const gridPos = this.getGridPos(mapXPos, mapYPos);
    return {
      gridXId: gridPos.gridXId,
      gridXPos: gridPos.gridXPos,
      gridYId: gridPos.gridYId,
      gridYPos: gridPos.gridYPos,
    };
  };

  getBottomLeftBumber = function (x, y) {
    const gridPos = this.getGridPos(x, y);
    const yCenter = this.height / 2;
    return {
      gridXId: gridPos.gridXId,
      gridXPos: gridPos.gridXPos,
      gridYId: gridPos.gridYPos > yCenter ? gridPos.gridYId + 1 : gridPos.gridYId,
      gridYPos:
        gridPos.gridYPos <= yCenter ? gridPos.gridYPos + yCenter : gridPos.gridYPos - yCenter,
    };
  };

  getTopRightBumber = function (mapXPos, mapYPos) {
    const gridPos = this.getGridPos(mapXPos, mapYPos);
    return {
      gridXId: gridPos.gridXPos === 0 ? gridPos.gridXId : gridPos.gridXId + 1,
      gridXPos: gridPos.gridXPos === 0 ? this.getWidth() : gridPos.gridXPos,
      gridYId: gridPos.gridYId,
      gridYPos: gridPos.gridYPos,
    };
  };

  getBottomRightBumber = function (mapXPos, mapYPos) {
    const gridPos = this.getGridPos(mapXPos, mapYPos);
    const yCenter = this.height / 2;
    return {
      gridXId: gridPos.gridXPos === 0 ? gridPos.gridXId : gridPos.gridXId + 1,
      gridXPos: gridPos.gridXPos === 0 ? this.getWidth() : gridPos.gridXPos,
      gridYId: gridPos.gridYPos > yCenter ? gridPos.gridYId + 1 : gridPos.gridYId,
      gridYPos:
        gridPos.gridYPos <= yCenter ? gridPos.gridYPos + yCenter : gridPos.gridYPos - yCenter,
    };
  };

  testCollision = function (entity2) {
    var rect1 = {
      x: this.getMapXPos() - this.getWidth() / 2,
      y: this.getMapYPos() - this.getHeight() / 2,
      width: this.getWidth(),
      height: this.getHeight(),
    };
    var rect2 = {
      x: entity2.getMapXPos() - entity2.getWidth() / 2,
      y: entity2.getMapYPos() - entity2.getHeight() / 2,
      width: entity2.getWidth(),
      height: entity2.getHeight(),
    };
    return testCollisionRectRect(rect1, rect2);
  };

  moveUp = function () {
    const x = this.getMapXPos();
    const nextMapYPos = this.getMapYPos() - this.getMoveSpeed();
    if (this.validateMoveUp(x, nextMapYPos)) {
      this.setMapYPos(nextMapYPos);
      this.gridPos = this.getGridPos(x, nextMapYPos);
      this.updateAnimation();
    }
    this.setDirectionMod(0);
  };

  moveDown = function () {
    const x = this.getMapXPos();
    const nextMapYPos = this.getMapYPos() + this.getMoveSpeed();
    if (this.validateMoveDown(x, nextMapYPos)) {
      this.setMapYPos(nextMapYPos);
      this.gridPos = this.getGridPos(x, nextMapYPos);
      this.updateAnimation();
    }
    this.setDirectionMod(2);
  };

  moveRight = function () {
    const y = this.getMapYPos();
    const nextMapXPos = this.getMapXPos() + this.getMoveSpeed();
    if (this.validateMoveRight(nextMapXPos, y)) {
      this.setMapXPos(nextMapXPos);
      this.gridPos = this.getGridPos(nextMapXPos, y);
      this.updateAnimation();
    }
    this.setDirectionMod(3);
  };

  moveLeft = function () {
    const y = this.getMapYPos();
    const nextMapXPos = this.getMapXPos() - this.getMoveSpeed();
    if (this.validateMoveLeft(nextMapXPos, y)) {
      this.setMapXPos(nextMapXPos);
      this.gridPos = this.getGridPos(nextMapXPos, y);
      this.updateAnimation();
    }
    this.setDirectionMod(1);
  };

  validateMoveUp = function (nextMapXPos, nextMapYPos) {
    let isValid1 = false;
    let isValid2 = false;
    const topLB = this.getTopLeftBumber(nextMapXPos, nextMapYPos);
    const topRB = this.getTopRightBumber(nextMapXPos, nextMapYPos);
    const topLBGV = currentMap.getGridValue(topLB.gridXId, topLB.gridYId);
    const topRBGV = currentMap.getGridValue(topRB.gridXId, topRB.gridYId);

    if (this.isNonPlayableTile(topLBGV, topRBGV)) {
      return false;
    } else if ((topLBGV === 2 && topRBGV === 2) || (topLBGV === 3 && topRBGV === 3)) {
      return true;
    } else {
      if (topLBGV === 2 || topLBGV === 3) {
        isValid1 = true;
      } else if (topLBGV === 4) {
        isValid1 = this.validateTopLeftAngle(topLB);
      } else {
        isValid1 = true;
      }

      if (topRBGV === 2 || topRBGV === 3) {
        isValid2 = true;
      } else if (topRBGV === 6) {
        isValid2 = this.validateTopRightAngle(topRB);
      } else {
        isValid2 = true;
      }
      return isValid1 && isValid2;
    }
  };

  validateMoveDown = function (nextMapXPos, nextMapYPos) {
    let isValid1 = false;
    let isValid2 = false;
    const botLB = this.getBottomLeftBumber(nextMapXPos, nextMapYPos);
    const botRB = this.getBottomRightBumber(nextMapXPos, nextMapYPos);
    const botLBGV = currentMap.getGridValue(botLB.gridXId, botLB.gridYId);
    const botRBGV = currentMap.getGridValue(botRB.gridXId, botRB.gridYId);

    if (this.isNonPlayableTile(botLBGV, botRBGV)) {
      return false;
    } else if ((botLBGV === 2 && botRBGV === 2) || (botLBGV === 3 && botRBGV === 3)) {
      return true;
    } else {
      if (botLBGV === 2 || botLBGV === 3) {
        isValid1 = true;
      } else if (botLBGV === 5) {
        isValid1 = this.validateBottomLeftAngle(botLB);
      } else {
        isValid1 = true;
      }

      if (botRBGV === 2 || botRBGV === 3) {
        isValid2 = true;
      } else if (botRBGV === 7) {
        isValid2 = this.validateBottomRighttAngle(botRB);
      } else {
        isValid2 = true;
      }
      return isValid1 && isValid2;
    }
  };

  validateMoveRight = function (nextMapXPos, nextMapYPos) {
    let isValid1 = false;
    let isValid2 = false;
    const topRB = this.getTopRightBumber(nextMapXPos, nextMapYPos);
    const botRB = this.getBottomRightBumber(nextMapXPos, nextMapYPos);
    const topRBGV = currentMap.getGridValue(topRB.gridXId, topRB.gridYId);
    const botRBGV = currentMap.getGridValue(botRB.gridXId, botRB.gridYId);

    if (this.isNonPlayableTile(topRBGV, botRBGV)) {
      return false;
    } else if ((topRBGV === 2 && botRBGV === 2) || (topRBGV === 3 && botRBGV === 3)) {
      return true;
    } else {
      if (topRBGV === 2 || topRBGV === 3) {
        isValid1 = true;
      } else if (topRBGV === 6) {
        isValid1 = this.validateTopRightAngle(topRB);
      } else {
        isValid1 = true;
      }

      if (botRBGV === 2 || botRBGV === 3) {
        isValid2 = true;
      } else if (botRBGV === 7) {
        isValid2 = this.validateBottomRighttAngle(botRB);
      } else {
        isValid2 = true;
      }
      return isValid1 && isValid2;
    }
  };

  validateMoveLeft = function (nextMapXPos, nextMapYPos) {
    let isValid1 = false;
    let isValid2 = false;
    const topLB = this.getTopLeftBumber(nextMapXPos, nextMapYPos);
    const botLB = this.getBottomLeftBumber(nextMapXPos, nextMapYPos);
    const topLBGV = currentMap.getGridValue(topLB.gridXId, topLB.gridYId);
    const botLBGV = currentMap.getGridValue(botLB.gridXId, botLB.gridYId);

    if (this.isNonPlayableTile(topLBGV, botLBGV)) {
      return false;
    } else if ((topLBGV === 2 && botLBGV === 2) || (topLBGV === 3 && botLBGV === 3)) {
      return true;
    } else {
      if (topLBGV === 2 || topLBGV === 3) {
        isValid1 = true;
      } else if (topLBGV === 4) {
        isValid1 = this.validateTopLeftAngle(topLB);
      } else {
        isValid1 = true;
      }

      if (botLBGV === 2 || botLBGV === 3) {
        isValid2 = true;
      } else if (botLBGV === 5) {
        isValid2 = this.validateBottomLeftAngle(botLB);
      } else {
        isValid2 = true;
      }
      return isValid1 && isValid2;
    }
  };

  isNonPlayableTile = function (bumber1Val, bumber2Val) {
    return bumber1Val === 1 || bumber1Val === 8 || bumber2Val === 1 || bumber2Val === 8;
  };

  validateTopLeftAngle = function (bumber) {
    const distance = TILE_SIZE * SIZE_MULT - bumber.gridYPos;
    if (bumber.gridXPos > distance) {
      return true;
    } else {
      return false;
    }
  };

  validateTopRightAngle = function (bumber) {
    if (bumber.gridXPos <= bumber.gridYPos) {
      return true;
    } else {
      return false;
    }
  };

  validateBottomLeftAngle = function (bumber) {
    if (bumber.gridXPos > bumber.gridYPos) {
      return true;
    } else {
      return false;
    }
  };

  validateBottomRighttAngle = function (bumber) {
    const distance = TILE_SIZE * SIZE_MULT - bumber.gridYPos;
    if (bumber.gridXPos <= distance) {
      return true;
    } else {
      return false;
    }
  };

  draw = function () {
    this.getCanvas().getCtx().save();
    const x = this.getMapXPos();
    const y = this.getMapYPos();
    const frameWidth = this.img.width / 3;
    const frameHeight = this.img.height / 4;
    this.getCanvas()
      .getCtx()
      .drawImage(
        this.img,
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

  updateAnimation = function () {
    this.setAnimationCounter(this.getAnimationCounter() + 0.5);
    this.setWalkingMod(Math.floor(this.getAnimationCounter()) % 3);
  };

  update = function () {
    this.updatePosition();
    this.draw();
  };
}
