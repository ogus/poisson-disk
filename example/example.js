(function (window, document) {
  'use strict';

  const DOM = {
    radius: null,
    button: null,
    canvas: null
  };

  const ENV = {
    radius: 0,
    intervalId: null,
    poissonDisk: null,
    ctx: null
  };

  window.onload = function () {
    DOM.canvas = document.getElementById("canvas");
    DOM.canvas.width = 500; DOM.canvas.height = 400;
    DOM.radius = document.getElementById("radius_input");
    DOM.button = document.getElementById("button");
    DOM.button.addEventListener("click", startGeneration, false);

    ENV.ctx = canvas.getContext("2d");
    ENV.ctx.fillStyle = "#00f";
    ENV.ctx.strokeStyle = "rgba(0,0,0,0.05)";
  }

  function startGeneration() {
    ENV.ctx.clearRect(0,0, canvas.width,canvas.height);

    ENV.radius = Math.max(DOM.radius.min, Math.min(parseInt(DOM.radius.value), DOM.radius.max));
    DOM.radius.value = ENV.radius;

    ENV.poissonDisk = new PoissonDisk([0, DOM.canvas.width, 0, DOM.canvas.height], ENV.radius);
    generatePointAnimation();
    // generateAllPoints();
  }

  function generatePointAnimation() {
    var id = window.setInterval(function () {
      let point = ENV.poissonDisk.next();
      if (!ENV.poissonDisk.done()) {
        drawPoint(ENV.ctx, point);
      }
      else {
        window.clearInterval(id);
      }
    }, 15);
  }

  function generateAllPoints() {
    let points = ENV.poissonDisk.all();
    for (let i = 0; i < points.length; i++) {
      drawPoint(ENV.ctx, points[i]);
    }
  }

  function drawPoint(ctx, p) {
    let x = p.x;
    let y = p.y;

    ctx.beginPath();
    ctx.arc(x,y, 2, 0,2*Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x,y, ENV.radius, 0,2*Math.PI);
    ctx.stroke();
  }
})(window, window.document);
