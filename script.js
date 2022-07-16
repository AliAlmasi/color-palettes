// Javascript port based on a Íñigo Quílez article on generating colour palettes
// http://www.iquilezles.org/www/articles/palettes/palettes.htm
var testPalettes = [{
  a: [0.5, 0.5, 0.5],
  b: [0.5, 0.5, 0.5],
  c: [1.0, 1.0, 1.0],
  d: [0.00, 0.33, 0.67]
}, {
  a: [0.5, 0.5, 0.5],
  b: [0.5, 0.5, 0.5],
  c: [1.0, 1.0, 1.0],
  d: [0.00, 0.10, 0.20]
}, {
  a: [0.5, 0.5, 0.5],
  b: [0.5, 0.5, 0.5],
  c: [1.0, 1.0, 1.0],
  d: [0.30, 0.20, 0.20]
}, {
  a: [0.5, 0.5, 0.5],
  b: [0.5, 0.5, 0.5],
  c: [1.0, 1.0, 0.5],
  d: [0.80, 0.90, 0.30]
}, {
  a: [0.5, 0.5, 0.5],
  b: [0.5, 0.5, 0.5],
  c: [1.0, 0.7, 0.4],
  d: [0.00, 0.15, 0.20]
}, {
  a: [0.5, 0.5, 0.5],
  b: [0.5, 0.5, 0.5],
  c: [2.0, 1.0, 0.0],
  d: [0.50, 0.20, 0.25]
}, {
  a: [0.8, 0.5, 0.4],
  b: [0.2, 0.4, 0.2],
  c: [2.0, 1.0, 1.0],
  d: [0.00, 0.25, 0.25]
}];

const rgb = {
  create: function() {
    return Object.create(rgb);
  },
  init: function(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
    return this;
  },
  toCanvasRGB: function() {
    return "rgb(" + parseInt(this.r * 255) + "," + parseInt(this.g * 255) + "," + parseInt(this.b * 255) + ")";
  },
  r: 0,
  g: 0,
  b: 0
};

var TWO_PI = 2 * Math.PI;

function colour(t, a, b, c, d) {
  // TODO - vectorify
  var red = a.r + b.r * Math.cos(TWO_PI * (c.r * (t + d.r)));
  var green = a.g + b.g * Math.cos(TWO_PI * (c.g * (t + d.g)));
  var blue = a.b + b.b * Math.cos(TWO_PI * (c.b * (t + d.b)));
  return rgb.create().init(red, green, blue).toCanvasRGB();
}

var canvas = document.getElementById('test');
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
var context = canvas.getContext('2d');

var numberOfColours = 1;
var maxNumberOfColours = 256;
var incrementColours = 1;
var index = 0;
var cols = {};

function animate(carryOn) {
  var example = testPalettes[index];
  for (var key in example) {
    var col = rgb.create();
    col.init(example[key][0], example[key][1], example[key][2]);
    cols[key] = col;
  }
  draw();
  cycle();
  
  if(carryOn) {
    requestAnimationFrame(animate);  
  }
}

function draw() {
  var increment = parseInt(canvasWidth / Math.min(canvasWidth, numberOfColours));
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  for (var i = 0; i < canvasWidth; i += increment) {
    context.fillStyle = colour(i / canvasWidth, cols.a, cols.b, cols.c, cols.d);
    context.fillRect(i, 0, increment, canvasHeight);
  }
}

function cycle() {
  // cycle through various examples and number of colours in palette
  numberOfColours += incrementColours;
  if (numberOfColours >= maxNumberOfColours || numberOfColours <= 1) {
    incrementColours *= -1;
    if (index < testPalettes.length - 1) {
      index += 1
    } else {
      index = 0;
    }
  }
}

function resize() {
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
}

window.addEventListener('resize', resize);

animate(true);
resize();