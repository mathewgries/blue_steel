runMap = function () {
  const newArray = formatArray(layers, rows, columns);
  const element = document.getElementById("output");
  element.innerHTML = JSON.stringify(newArray, null, 2);
};

const data = river_013;
const firstgid = data.firstgid;
const rows = data.height;
const columns = data.width;
const layerCount = data.layers.length;
const layerNames = data.layers.map((x) => x.name);
const layers = data.layers.map((x) => x.data);

formatArray = function (data, height, width) {
  let outerArr = [];
  for (let i = 0; i < height; i++) {
    let innerArr = [];
    for (let j = 0; j < width; j++) {
      innerArr.push(0);
    }
    outerArr.push(innerArr);
  }

  for (let x = 0; x < data.length; x++) {
    const layer = data[x];
    for (let i = 0; i < outerArr.length; i++) {
      for (let j = 0; j < outerArr[i].length; j++) {
        const newVal = layer[i * width + j];
        const currentValue = outerArr[i][j];
        if (newVal !== 0 && currentValue !== 3) {
          outerArr[i][j] = valueConversion(newVal);
        }
      }
    }
  }

  return outerArr;
};

//Map Key
// 0: non playable tile
// 1: wall edge =
// 2: open terain
// 3: entrance
// 4: TL angled wall
// 5: BL angled wall
// 6: TR angled wall
// 7: BR angled wall
// 8: Water

valueConversion = function (val) {
  if (val === 0) {
    return val;
  }

  const wallObjs = [
    7, 8, 9, 19, 56, 57, 58, 59, 66, 67, 68, 69, 74, 77, 92, 95, 110, 111, 112, 113, 163, 164, 165,
    166, 167, 168, 181, 182, 183, 184, 185, 186, 199, 200, 201, 202, 203, 204, 271, 272, 273, 274,
    276, 277, 279, 280, 282, 283, 285, 286, 291, 292, 294, 295, 297, 298, 300, 301, 303, 304, 307,
    308, 310, 311, 312, 313, 343, 344, 345, 346, 347, 348, 361, 362, 363, 364, 365, 366, 379, 380,
    381, 382, 383, 384,
  ];
  const freeRoamObjs = [
    1, 2, 3, 4, 5, 38, 39, 40, 41, 45, 46, 47, 48, 55, 60, 62, 67, 73, 78, 80, 84, 91, 96, 98, 103,
    109, 114, 116, 121, 128, 129, 130, 131, 135, 136, 137, 138, 289, 290,
  ];
  const topLeftAngledWalls = [236, 238];
  const bottomLeftAngledWalls = [218, 220];
  const topRightAngledWalls = [235, 237];
  const bottomRightAngledWalls = [217, 219];
  const entranceObjs = [20];

  if (wallObjs.includes(val)) {
    return 1;
  } else if (freeRoamObjs.includes(val)) {
    return 2;
  } else if (topLeftAngledWalls.includes(val)) {
    return 4;
  } else if (bottomLeftAngledWalls.includes(val)) {
    return 5;
  } else if (topRightAngledWalls.includes(val)) {
    return 6;
  } else if (bottomRightAngledWalls.includes(val)) {
    return 7;
  } else if (entranceObjs.includes(val)) {
    return 3;
  }
};
