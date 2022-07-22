Player = function (mapWidth, mapHeight, TILE_SIZE, SIZE_MULT) {
  var self = {
    mapXPos: mapWidth / 2,
    mapYPos: mapHeight / 2,
    moveSpd: 7,
    width: TILE_SIZE * SIZE_MULT,
    height: TILE_SIZE * SIZE_MULT,
  };

  self.img = {};
  self.img.withoutItems = new Image();
  self.img.withoutItems.src = "img/entities/player_no_items.png";
  self.img.withShield = new Image();
  self.img.withShield.src = "img/entities/player_with_shield.png";
  self.img.currentImage = self.img.withoutItems;

  self.pressingRight = false;
  self.pressingLeft = false;
  self.pressingDown = false;
  self.pressingUp = false;
  self.directionMod = 2;
  self.animationCounter = 0;
  self.walkingMod = 1;

  self.updatePosition = function () {
    if (self.validateKeyPress()) {
      let nextMapXPos = self.mapXPos;
      let nextMapYPos = self.mapYPos;

      if (self.pressingUp) {
        self.directionMod = 0;
        nextMapYPos -= self.moveSpd;
        if (self.validateMoveUp(nextMapXPos, nextMapYPos)) {
          self.mapYPos = nextMapYPos;
          self.updateAnimation();
        }
      }

      if (self.pressingDown) {
        self.directionMod = 2;
        nextMapYPos += self.moveSpd;
        if (self.validateMoveDown(nextMapXPos, nextMapYPos)) {
          self.mapYPos = nextMapYPos;
          self.updateAnimation();
        }
      }

      if (self.pressingRight) {
        self.directionMod = 3;
        nextMapXPos += self.moveSpd;
        if (self.validateMoveRight(nextMapXPos, nextMapYPos)) {
          self.mapXPos = nextMapXPos;
          if (!self.pressingDown && !self.pressingUp) {
            self.updateAnimation();
          }
        }
      }

      if (self.pressingLeft) {
        self.directionMod = 1;
        nextMapXPos -= self.moveSpd;
        if (self.validateMoveLeft(nextMapXPos, nextMapYPos)) {
          self.mapXPos = nextMapXPos;
          if (!self.pressingDown && !self.pressingUp) {
            self.updateAnimation();
          }
        }
      }
    }
  };

  self.validateKeyPress = function () {
    let valid = true;
    if (self.pressingUp && self.pressingDown) {
      valid = false;
    } else if (self.pressingLeft && self.pressingRight) {
      valid = false;
    }
    return valid;
  };

  self.validateMoveUp = function (nextMapXPos, nextMapYPos) {
    let isValid1 = false;
    let isValid2 = false;
    const topLB = self.getTopLeftBumber(nextMapXPos, nextMapYPos);
    const topRB = self.getTopRightBumber(nextMapXPos, nextMapYPos);
    const topLBGV = currentMap.getGridValue(topLB.gridXId, topLB.gridYId);
    const topRBGV = currentMap.getGridValue(topRB.gridXId, topRB.gridYId);

    if (self.isNonPlayableTile(topLBGV, topRBGV)) {
      return false;
    } else if ((topLBGV === 2 && topRBGV === 2) || (topLBGV === 3 && topRBGV === 3)) {
      return true;
    } else {
      if (topLBGV === 2 || topLBGV === 3) {
        isValid1 = true;
      } else if (topLBGV === 4) {
        isValid1 = self.validateTopLeftAngle(topLB);
      } else {
        isValid1 = true;
      }

      if (topRBGV === 2 || topRBGV === 3) {
        isValid2 = true;
      } else if (topRBGV === 6) {
        isValid2 = self.validateTopRightAngle(topRB);
      } else {
        isValid2 = true;
      }
      return isValid1 && isValid2;
    }
  };

  self.validateMoveDown = function (nextMapXPos, nextMapYPos) {
    let isValid1 = false;
    let isValid2 = false;
    const botLB = self.getBottomLeftBumber(nextMapXPos, nextMapYPos);
    const botRB = self.getBottomRightBumber(nextMapXPos, nextMapYPos);
    const botLBGV = currentMap.getGridValue(botLB.gridXId, botLB.gridYId);
    const botRBGV = currentMap.getGridValue(botRB.gridXId, botRB.gridYId);

    if (self.isNonPlayableTile(botLBGV, botRBGV)) {
      return false;
    } else if ((botLBGV === 2 && botRBGV === 2) || (botLBGV === 3 && botRBGV === 3)) {
      return true;
    } else {
      if (botLBGV === 2 || botLBGV === 3) {
        isValid1 = true;
      } else if (botLBGV === 5) {
        isValid1 = self.validateBottomLeftAngle(botLB);
      } else {
        isValid1 = true;
      }

      if (botRBGV === 2 || botRBGV === 3) {
        isValid2 = true;
      } else if (botRBGV === 7) {
        isValid2 = self.validateBottomRighttAngle(botRB);
      } else {
        isValid2 = true;
      }
      return isValid1 && isValid2;
    }
  };

  self.validateMoveRight = function (nextMapXPos, nextMapYPos) {
    let isValid1 = false;
    let isValid2 = false;
    const topRB = self.getTopRightBumber(nextMapXPos, nextMapYPos);
    const botRB = self.getBottomRightBumber(nextMapXPos, nextMapYPos);
    const topRBGV = currentMap.getGridValue(topRB.gridXId, topRB.gridYId);
    const botRBGV = currentMap.getGridValue(botRB.gridXId, botRB.gridYId);

    if (self.isNonPlayableTile(topRBGV, botRBGV)) {
      return false;
    } else if ((topRBGV === 2 && botRBGV === 2) || (topRBGV === 3 && botRBGV === 3)) {
      return true;
    } else {
      if (topRBGV === 2 || topRBGV === 3) {
        isValid1 = true;
      } else if (topRBGV === 6) {
        isValid1 = self.validateTopRightAngle(topRB);
      } else {
        isValid1 = true;
      }

      if (botRBGV === 2 || botRBGV === 3) {
        isValid2 = true;
      } else if (botRBGV === 7) {
        isValid2 = self.validateBottomRighttAngle(botRB);
      } else {
        isValid2 = true;
      }
      return isValid1 && isValid2;
    }
  };

  self.validateMoveLeft = function (nextMapXPos, nextMapYPos) {
    let isValid1 = false;
    let isValid2 = false;
    const topLB = self.getTopLeftBumber(nextMapXPos, nextMapYPos);
    const botLB = self.getBottomLeftBumber(nextMapXPos, nextMapYPos);
    const topLBGV = currentMap.getGridValue(topLB.gridXId, topLB.gridYId);
    const botLBGV = currentMap.getGridValue(botLB.gridXId, botLB.gridYId);

    if (self.isNonPlayableTile(topLBGV, botLBGV)) {
      return false;
    } else if ((topLBGV === 2 && botLBGV === 2) || (topLBGV === 3 && botLBGV === 3)) {
      return true;
    } else {
      if (topLBGV === 2 || topLBGV === 3) {
        isValid1 = true;
      } else if (topLBGV === 4) {
        isValid1 = self.validateTopLeftAngle(topLB);
      } else {
        isValid1 = true;
      }

      if (botLBGV === 2 || botLBGV === 3) {
        isValid2 = true;
      } else if (botLBGV === 5) {
        isValid2 = self.validateBottomLeftAngle(botLB);
      } else {
        isValid2 = true;
      }
      return isValid1 && isValid2;
    }
  };

  self.isNonPlayableTile = function (bumber1Val, bumber2Val) {
    return bumber1Val === 1 || bumber1Val === 8 || bumber2Val === 1 || bumber2Val === 8;
  };

  self.validateTopLeftAngle = function (bumber) {
    const distance = TILE_SIZE * SIZE_MULT - bumber.gridYPos;
    if (bumber.gridXPos > distance) {
      return true;
    } else {
      return false;
    }
  };

  self.validateTopRightAngle = function (bumber) {
    if (bumber.gridXPos <= bumber.gridYPos) {
      return true;
    } else {
      return false;
    }
  };

  self.validateBottomLeftAngle = function (bumber) {
    if (bumber.gridXPos > bumber.gridYPos) {
      return true;
    } else {
      return false;
    }
  };

  self.validateBottomRighttAngle = function (bumber) {
    const distance = TILE_SIZE * SIZE_MULT - bumber.gridYPos;
    if (bumber.gridXPos <= distance) {
      return true;
    } else {
      return false;
    }
  };

  self.getGridPos = function (mapXPos, mapYPos) {
    return {
      gridXId: Math.floor(mapXPos / self.width),
      gridYId: Math.floor((mapYPos + self.height / 2) / self.height),
      gridXPos: mapXPos % self.width,
      gridYPos: (mapYPos + self.height / 2) % self.height,
    };
  };

  self.getTopLeftBumber = function (mapXPos, mapYPos) {
    const gridPos = self.getGridPos(mapXPos, mapYPos);
    return {
      gridXId: gridPos.gridXId,
      gridXPos: gridPos.gridXPos,
      gridYId: gridPos.gridYId,
      gridYPos: gridPos.gridYPos,
    };
  };

  self.getBottomLeftBumber = function (mapXPos, mapYPos) {
    const gridPos = self.getGridPos(mapXPos, mapYPos);
    const yCenter = self.height / 2;
    return {
      gridXId: gridPos.gridXId,
      gridXPos: gridPos.gridXPos,
      gridYId: gridPos.gridYPos > yCenter ? gridPos.gridYId + 1 : gridPos.gridYId,
      gridYPos:
        gridPos.gridYPos <= yCenter ? gridPos.gridYPos + yCenter : gridPos.gridYPos - yCenter,
    };
  };

  self.getTopRightBumber = function (mapXPos, mapYPos) {
    const gridPos = self.getGridPos(mapXPos, mapYPos);
    return {
      gridXId: gridPos.gridXPos === 0 ? gridPos.gridXId : gridPos.gridXId + 1,
      gridXPos: gridPos.gridXPos === 0 ? self.width : gridPos.gridXPos,
      gridYId: gridPos.gridYId,
      gridYPos: gridPos.gridYPos,
    };
  };

  self.getBottomRightBumber = function (mapXPos, mapYPos) {
    const gridPos = self.getGridPos(mapXPos, mapYPos);
    const yCenter = self.height / 2;
    return {
      gridXId: gridPos.gridXPos === 0 ? gridPos.gridXId : gridPos.gridXId + 1,
      gridXPos: gridPos.gridXPos === 0 ? self.width : gridPos.gridXPos,
      gridYId: gridPos.gridYPos > yCenter ? gridPos.gridYId + 1 : gridPos.gridYId,
      gridYPos:
        gridPos.gridYPos <= yCenter ? gridPos.gridYPos + yCenter : gridPos.gridYPos - yCenter,
    };
  };

  self.draw = function () {
    ctx.save();
    const x = self.mapXPos;
    const y = self.mapYPos;
    const frameWidth = self.img.currentImage.width / 3;
    const frameHeight = self.img.currentImage.height / 4;
    ctx.drawImage(
      self.img.currentImage,
      self.walkingMod * frameWidth,
      self.directionMod * frameHeight,
      frameWidth,
      frameHeight,
      x,
      y,
      self.width,
      self.height
    );
    ctx.restore();
  };

  self.updateAnimation = function () {
    self.animationCounter += 0.5;
    self.walkingMod = Math.floor(self.animationCounter) % 3;
  };

  self.update = function () {
    if (self.pressingDown || self.pressingUp || self.pressingRight || self.pressingLeft) {
      self.updatePosition();
    }

    self.draw();
  };
  return self;
};

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