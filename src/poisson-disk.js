(function (root, factory) {
  if (typeof define === 'function' && define.amd) { define([], factory); }
  else if (typeof module === 'object' && module.exports) { module.exports = factory(); }
  else { root.PoissonDisk = factory(); }
}(this, function () {
  'use strict';

  var xMin = 0;
  var xMax = 0;
  var yMin = 0;
  var yMax = 0;
  var radius = 1;
  var k = 30;
  var random = Math.random;
  var pointQueue = [];
  var firstPoint = true;

  var grid = {
    width: 0,
    height: 0,
    cellSize: 0,
    data: []
  };

  function parse(x, k) {
    return !isNaN(parseFloat(x)) ? parseFloat(x) : k;
  }

  function initializeParameters(viewport, minDistance, maxTries, rng) {
    xMin = parse(viewport[0], 0);
    xMax = parse(viewport[1], 0);
    yMin = parse(viewport[2], 0);
    yMax = parse(viewport[3], 0);
    radius = Math.max(parse(minDistance, 1), 1);
    k = parse(maxTries, 30) | 0;
    random = typeof(rng) === 'function' ? rng : Math.random;
    grid.cellSize = radius * Math.SQRT1_2;
    grid.width = Math.ceil((xMax - xMin) / grid.cellSize);
    grid.height = Math.ceil((yMax - yMin) / grid.cellSize);
    grid.data = new Array(grid.width * grid.height);
  }

  function initializeState() {
    pointQueue = new Array(0);
    firstPoint = true;
    for (let i = 0; i < grid.data.length; i++) {
      grid.data[i] = null;
    }
  }

  function newPoint(x, y) {
    return {x: x, y: y};
  }

  function dist2(x1, y1, x2, y2) {
    return ((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1));
  }

  function createNewPoint(x, y) {
    let point = newPoint(x, y);
    let index = Math.floor(x / grid.cellSize) + Math.floor(y / grid.cellSize) * grid.width;
    grid.data[index] = point;
    pointQueue.push(point);
    return point;
  }

  function isValidPoint(x, y) {
    if (x < xMin || x > xMax || y < yMin || y > yMax) {
      return false;
    }
    let col = Math.floor((x-xMin) / grid.cellSize);
    let row = Math.floor((y-yMin) / grid.cellSize);
    let idx = 0, i = 0, j = 0;
    for (i = col-2; i <= col+2; i++) {
      for (j = row-2; j <= row+2; j++) {
        if (i >= 0 && i < grid.width && j >= 0 && j < grid.height) {
          idx = i + (j * grid.width);
          if (grid.data[idx] !== null &&
            dist2(x, y, grid.data[idx].x, grid.data[idx].y) <= (radius*radius)) {
            return false;
          }
        }
      }
    }
    return true;
  }

  function nextPoint() {
    let x = 0
    let y = 0;
    if (firstPoint) {
      firstPoint = false;
      x = xMin + (xMax - xMin) * random();
      y = yMin + (yMax - yMin) * random();
      return createNewPoint(x, y);
    }
    let idx = 0, distance = 0, angle = 0
    while (pointQueue.length > 0) {
      idx = (pointQueue.length * random()) | 0;
      for (let i = 0; i < k; i++) {
        distance = radius * (random() + 1);
        angle = 2*Math.PI * random();
        x = pointQueue[idx].x + distance*Math.cos(angle);
        y = pointQueue[idx].y + distance*Math.sin(angle);
        if (isValidPoint(x, y)) {
          return createNewPoint(x, y);
        }
      }
      pointQueue.splice(idx, 1);
    }
    return null;
  }

  function allPoints() {
    let point = null;
    let result = new Array(0);
    while (true) {
      point = nextPoint();
      if (point == null) {
        break;
      }
      else {
        result.push(point);
      }
    }
    return result;
  }

  function PoissonDisk(viewport, minDistance, maxTries, rng) {
    initializeParameters(viewport, minDistance, maxTries, rng);
    initializeState();
  }

  PoissonDisk.prototype = {
    reset: function () {
      initializeState();
    },

    next: function () {
      return nextPoint();
    },

    all: function () {
      initializeState();
      return allPoints();
    },

    done: function () {
      return !firstPoint && pointQueue.length == 0;
    }
  };

  return PoissonDisk;
}));
