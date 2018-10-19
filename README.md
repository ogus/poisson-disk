# Poisson Disk Sampling

A fast Poisson disk sampling module to generate random homogeneous sets of points.


## Demo

A Web demonstration of this module can be found in the `demo` directory, and is also available [online](https://cdn.rawgit.com/ogus/poisson-disk/2b73c475/demo/index.html).


## Installation

Clone this repository and import `poisson-disk.js` or `poisson-disk.min.js` from the `src` directory in your own project.

This module has no dependencies.


## Usage

### Example

```js
var viewport = [0, 0, 100, 100];
var minDistance = 10;

var iterator = new PoissonDisk(viewport, minDistance);

var p1 = iterator.next().value;
var p2 = iterator.next().value;
```

### Create a new iterator

The `PoissonDisk` constructor has two main arguments:

 + The viewport of the points sample

 + The minimum distance between each point

```js
var viewport = [0, 0, 100, 100];
var minDistance = 10;

var iterator = new PoissonDisk(viewport, minDistance);
```

It returns a Javascript iterator object.

### Get values from the iterator

The iterator object has a single method : `next()`.

This method return an object with two properties, `data` and `done`.

```js
var loop = true;

while (loop) {
  var p = iterator.next();
  console.log(p.data);

  if (p.done) {
    loop = false;
  }
}
```

For more informations on iterator object, take a look at the [MDN doc](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators)

### Point data format

Each point is formated as an Array with `[x, y]` values.

```js
var iterator = new PoissonDisk([-50, -50, 200, 200], 10);

var point = iterator.next().data;
console.log(point);  // displays [x, y] coordinates
```


## Credits

This Javascript implementation is based on [this paper](https://www.cs.ubc.ca/~rbridson/docs/bridson-siggraph07-poissondisk.pdf) by Robert Bridson.


## License

There is currently no license on this module.
