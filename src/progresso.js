'use strict';

var options = {
  focus: true, // whether or not to focus on start
  hideClass: null,
  showClass: 'progresso-show',
  wrapperClass: 'progresso-wrap',
  fillClass: 'progresso-fill'
};

function Progresso(userOpts) {
  userOpts = userOpts || {};
  // merge in user's options
  for (var attrname in userOpts) {
    options[attrname] = userOpts[attrname];
  }

  this.options = options;
  this.fill = createProgresso(this.options);
  this.wrapper = this.fill.parentNode;
  this.going = false;
  this.currentValue = 0;
  this.events = {};
}

Progresso.prototype.start = function() {
  this.going = true;

  // ensure it is visible
  this.show();

  // kick off a smooth loader...
  this.smooth();

  if (this.options.focus) {
    this.wrapper.focus();
  }

  var self = this;
  // randomly increment at a random interval
  (function loop() {
    var time = randomBetween(500, 3e3); // between 500ms and 3s
    var inc = randomBetween(3, 10); // between 3% and 10%

    setTimeout(function () {
      if (!self.going) { return; }
      self.increment(inc);
      loop();
    }, time);
  }());
  return this;
};

Progresso.prototype.smooth = function () {
  this.going = true;

  var self = this;
  var smoothInterval = setInterval(function () {
    if (!self.going) {
      clearInterval(smoothInterval);
      return;
    }

    self.increment(1);
  }, 400);

  return this;
};

Progresso.prototype.pause = function () {
  this.going = false;
  return this;
};

Progresso.prototype.done = function () {
  this.goTo(100);
  this.pause();
  return this;
};

Progresso.prototype.goTo = function (n) {
  var self = this;

  // ensure it is visible
  this.show();

  // prevent progress - stop at 100%
  if (n >= 100) {
    this.pause();
    // trigger complete event (after 400ms for the css animation delay)...
    setTimeout(function () {
      self.trigger('complete');
    }, 400);
    n = 100;
  }

  this.wrapper.setAttribute('aria-valuenow', n);
  this.fill.style.width = n + '%';
  this.currentValue = n;
  this.trigger('change');
  return this;
};

Progresso.prototype.increment = function (inc) {
  this.goTo(this.currentValue + inc);
  return this;
};

Progresso.prototype.show = function () {
  if (this.options.hideClass) {
    this.wrapper.classList.remove(this.options.hideClass);
  }

  this.wrapper.classList.add(this.options.showClass);
  return this;
};

Progresso.prototype.hide = function () {
  if (this.options.hideClass) {
    this.wrapper.classList.add(this.options.hideClass);
  }

  this.wrapper.classList.remove(this.options.showClass);
  return this;
};

/**
 * Events
 */

Progresso.prototype.on = function (eventType, fn) {
  this.events[eventType] = fn;
  return this;
};

Progresso.prototype.off = function (eventType) {
  this.events[eventType] = null;
  return this;
};

Progresso.prototype.trigger = function (eventType) {
  var e = this.events[eventType];
  if (e) {
    e.call(this, {
      type: eventType
    });
  }
};

function createProgresso(opts) {
  var wrapper = document.createElement('div');
  var fill = document.createElement('div');

  wrapper.appendChild(fill);

  setAttrs(wrapper, {
    role: 'progressbar',
    'aria-valuenow': '0',
    'aria-valuemin': '0',
    'aria-valuemax': '100'
  });

  if (opts.focus) {
    wrapper.tabIndex = -1;
  }

  wrapper.classList.add(opts.wrapperClass || '');
  fill.classList.add(opts.fillClass);

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