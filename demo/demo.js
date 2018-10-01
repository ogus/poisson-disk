"use strict";

var dom = {
  radius: null,
  button: null
};

var state = {
  radius: 0,
  intervalID: null
};

var canvas, ctx, poissonDisk;

window.onload = function () {
  dom.radius = document.getElementById("radius_input");
  dom.button = document.getElementById("button");

  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  ctx.fillStyle = "#f00";
  ctx.strokeStyle = "rgba(0,0,0,0.05)";

  dom.button.addEventListener("click", startGeneration, false);
}

function startGeneration() {
  ctx.clearRect(0,0, canvas.width,canvas.height);

  state.radius = Math.max(dom.radius.min, Math.min(parseInt(dom.radius.value), dom.radius.max));
  dom.radius.value = state.radius;

  poissonDisk = new PoissonDisk([0,canvas.width, 0,canvas.height], state.radius);
  state.intervalID = window.setInterval(generatePoint, 20);
}

function generatePoint() {
  let point = poissonDisk.next();
  if (point.done) {
    window.clearInterval(state.intervalID);
  }
  else {
    drawPoint(point.value);
  }
}

function drawPoint(p) {
  let x = p[0], y = p[1];

  ctx.beginPath();
  ctx.arc(x,y, 2, 0,2*Math.PI);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x,y, state.radius, 0,2*Math.PI);
  ctx.stroke();
}
