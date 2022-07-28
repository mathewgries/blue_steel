class Entity {
  constructor(type, xPos, yPos, moveSpd, mapWidth, mapHeight, TILE_SIZE, SIZE_MULT) {
    this.type = type;
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    this.mapXPos = xPos;
    this.mapYPos = yPos;
    this.width = TILE_SIZE * SIZE_MULT;
    this.height = TILE_SIZE * SIZE_MULT;
    this.moveSpd = moveSpd;
    this.directionMod = 2;
    this.animationCounter = 0;
    this.walkingMod = 1;
  }

  testCollision = function (entity2) {
    //return if colliding (true/false)
    var rect1 = {
      x: this.mapXPos - this.width / 2,
      y: this.mapYPos - this.height / 2,
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

  moveUp = function (nextMapXPos, nextMapYPos) {
    this.directionMod = 0;
    nextMapYPos -= this.moveSpd;
    if (this.validateMoveUp(nextMapXPos, nextMapYPos)) {
      this.mapYPos = nextMapYPos;
      this.gridPos = this.getGridPos(this.mapXPos, this.mapYPos);
      this.updateAnimation();
    }
  };

  moveDown = function (nextMapXPos, nextMapYPos) {
    this.directionMod = 2;
    nextMapYPos += this.moveSpd;
    if (this.validateMoveDown(nextMapXPos, nextMapYPos)) {
      this.mapYPos = nextMapYPos;
      this.gridPos = this.getGridPos(this.mapXPos, this.mapYPos);
      this.updateAnimation();
    }
  };

  moveRight = function (nextMapXPos, nextMapYPos) {
    this.directionMod = 3;
    nextMapXPos += this.moveSpd;
    if (this.validateMoveRight(nextMapXPos, nextMapYPos)) {
      this.mapXPos = nextMapXPos;
      this.gridPos = this.getGridPos(this.mapXPos, this.mapYPos);
      this.updateAnimation();
    }
  };

  moveLeft = function (nextMapXPos, nextMapYPos) {
    this.directionMod = 1;
    nextMapXPos -= this.moveSpd;
    if (this.validateMoveLeft(nextMapXPos, nextMapYPos)) {
      this.mapXPos = nextMapXPos;
      this.gridPos = this.getGridPos(this.mapXPos, this.mapYPos);
      this.updateAnimation();
    }
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

  getCenterPos = function () {
    return {
      gridXId: Math.floor((this.mapXPos + this.width / 2) / this.width),
      gridYId: Math.floor((this.mapYPos + this.height / 2) / this.height),
    };
  };

  getGridPos = function (x, y) {
    return {
      gridXId: Math.floor(x / this.width),
      gridYId: Math.floor((y + this.height / 2) / this.height),
      gridXPos: x % this.width,
      gridYPos: (y + this.height / 2) % this.height,
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

  getBottomLeftBumber = function (mapXPos, mapYPos) {
    const gridPos = this.getGridPos(mapXPos, mapYPos);
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
      gridXPos: gridPos.gridXPos === 0 ? this.width : gridPos.gridXPos,
      gridYId: gridPos.gridYId,
      gridYPos: gridPos.gridYPos,
    };
  };

  getBottomRightBumber = function (mapXPos, mapYPos) {
    const gridPos = this.getGridPos(mapXPos, mapYPos);
    const yCenter = this.height / 2;
    return {
      gridXId: gridPos.gridXPos === 0 ? gridPos.gridXId : gridPos.gridXId + 1,
      gridXPos: gridPos.gridXPos === 0 ? this.width : gridPos.gridXPos,
      gridYId: gridPos.gridYPos > yCenter ? gridPos.gridYId + 1 : gridPos.gridYId,
      gridYPos:
        gridPos.gridYPos <= yCenter ? gridPos.gridYPos + yCenter : gridPos.gridYPos - yCenter,
    };
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
    this.updatePosition();

    this.draw();
  };
}
