'use strict';

var defaults = {};

function Progresso(userOpts) {
  userOpts = userOpts || {};
  // merge in defaults
  for (var attrname in userOpts) {
    defaults[attrname] = userOpts[attrname];
  }

  this.options = defaults;
  this.fill = createProgresso();
  this.wrapper = this.fill.parentNode;
  this.going = false;
  this.currentValue = 0;
}

Progresso.prototype.start = function() {
  this.going = true;
  // ensure it is visible
  this.show();
  this.increment(randomBetween(3, 7));
  var self = this;
  // randomly increment at a random interval
  (function loop() {
    if (!self.going) { return; }

    var time = randomBetween(500, 3e3);
    var inc = randomBetween(3, 11);

    setTimeout(function () {
      self.increment(inc);
      loop();
    }, time);
  }());
};

Progresso.prototype.pause = function () {
  this.going = false;
};

Progresso.prototype.done = function () {
  this.goTo(100);
  this.pause();
};

Progresso.prototype.goTo = function (n) {
  // ensure it is visible
  this.show();

  // prevent progress - stop at 100%
  if (n >= 100) {
    this.pause();
    n = 100;
  }

  this.wrapper.setAttribute('aria-valuenow', n);
  this.fill.style.width = n + '%';
  this.currentValue = n;
};

Progresso.prototype.increment = function (inc) {
  if (inc >= 100) {
    this.pause();
    newValue = 100;
  }

  this.goTo(this.currentValue + inc);
};

Progresso.prototype.show = function () {
  this.wrapper.classList.add('progresso-show');
};

Progresso.prototype.hide = function () {
  this.wrapper.classList.remove('progresso-show');
};

function createProgresso() {
  var wrapper = document.createElement('div');
  var fill = document.createElement('div');

  wrapper.appendChild(fill);

  setAttrs(wrapper, {
    role: 'progressbar',
    'aria-valuenow': '0',
    'aria-valuemin': '0',
    'aria-valuemax': '100'
  });


  wrapper.classList.add('progresso-wrap');
  fill.classList.add('progresso-fill');

  document.body.appendChild(wrapper);

  return fill;
}

function setAttrs(element, attrs) {
  for (var name in attrs) {
    var val = attrs[name];
    element.setAttribute(name, val);
  }
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * max) + min;
}