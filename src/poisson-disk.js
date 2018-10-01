(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
      define([], factory);
  } else if (typeof module === 'object' && module.exports) {
      module.exports = factory();
  } else {
      root.PoissonDisk = factory();
  }
}(this, function () {
  "use strict";

  var xMin, xMax, yMin, yMax,
      radius, k, random;

  var grid = {
    width: 0,
    height: 0,
    cellSize: 0,
    data: []
  };

  var queue, first;

  /**
   * Poisson-Disk Sampling
   * This algorithm create a random set of tightly-packed 2D points
   *
   * @constructor
   * @param {Array} viewport Definition of the dimensions: [xMin, xMax, yMin, yMax]
   * @param {float} minDistance Minimum distance between each point
   * @param {int} [maxTries=30] Maximum number of tries before a point is rejected
   * @param {function} [rng=Math.random] Function used to generate random numbers
   * @return {function} Iterator with point values
   */
   function PoissonDisk(viewport, minDistance, maxTries, rng) {
    xMin = parseFloat(viewport[0]);
    xMax = parseFloat(viewport[1]);
    yMin = parseFloat(viewport[2]);
    yMax = parseFloat(viewport[3]);
    radius = parseFloat(minDistance);
    k = parseInt(maxTries) || 30;
    random = typeof(rng) == 'function' ? rng : Math.random;

    grid.cellSize = radius * Math.SQRT1_2;
    grid.width = Math.ceil((xMax - xMin) / grid.cellSize);
    grid.height = Math.ceil((yMax - yMin) / grid.cellSize);
    grid.data = new Array(grid.width * grid.height);
    grid.data.fill(null);

    queue = [];
    first = true;

    return {
      /**
       * Iterator that return point value from the sampling
       * @return {Object} {done: boolean, value: [x, y]}
       */
      next: function () {
        let x = 0, y = 0;

        if (first) {
          first = false;
          x = xMin + (xMax - xMin) * random();
          y = yMin + (yMax - yMin) * random();
          return newPoint(x, y);
        }

        let idx = 0, point = [];
        while(queue.length > 0) {
          idx = (queue.length * random()) | 0;
          point = queue[idx];

          let dist = 0, angle = 0;
          for (let i = 0; i < k; i++) {
            dist = radius * (1 + random());
            angle = 2*Math.PI * random();

            x = point[0] + dist*Math.cos(angle);
            y = point[1] + dist*Math.sin(angle);

            if (isValidPoint(x, y)) {
              return newPoint(x, y);
            }
          }
          queue.splice(idx, 1);
        }

        return {
          done: true,
          value: null
        };
      }
    };
  }

  /**
   * Utility methods
   */

  /**
   * Add a new point to the current sample
   */
  function newPoint(x, y) {
    let i = Math.floor(x / grid.cellSize) + Math.floor(y / grid.cellSize) * grid.width;
    grid.data[i] = [x, y];
    queue.push([x, y]);

    return {
      done: false,
      value: [x, y]
    };
  }

  /**
   * Check the validity of a point
   */
  function isValidPoint(x, y) {
    if (x < xMin || x > xMax || y < yMin || y > yMax) {
      return false;
    }

    let col = Math.floor((x-xMin) / grid.cellSize);
    let row = Math.floor((y-yMin) / grid.cellSize);
    let idx = 0, i = 0, j = 0;

    for (i = col-2; i <= col+2; i++) {
      for (j = row-2; j <= row+2; j++) {
        if (i < 0 || i >= grid.width || j < 0 || j >= grid.height) continue;
        idx = i + (j*grid.width);
        if(grid.data[idx] !== null && dist([x,y], grid.data[idx]) <= (radius*radius)) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Square distance between two points
   */
  function dist(p1, p2) {
    let dx = p2[0] - p1[0],
        dy = p2[1] - p1[1];
    return (dx*dx) + (dy*dy);
  }

  return PoissonDisk;
}));
