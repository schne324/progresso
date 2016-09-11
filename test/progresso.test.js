'use strict';

describe('progresso', function () {
  var prog;
  before(function () {
    prog = new Progresso();
  });

  afterEach(function () {
    prog.goTo(0);
  });

  after(function () {
    prog.hide(); // TODO: if/when there is a destroy method, use it here
  });

  describe('properties/attributes', function () {
    it('should set proper element refs for fill and wrapper', function () {
      var wrapper = document.querySelector('.progresso-wrap');
      assert.equal(prog.fill, wrapper.querySelector('.progresso-fill'));
      assert.equal(prog.wrapper, wrapper);
    });

    it('should set role/aria attributes on the wrapper', function () {
      var wrapper = prog.wrapper;
      assert.equal(wrapper.getAttribute('role'), 'progressbar');
      assert.equal(wrapper.getAttribute('aria-valuenow'), '0');
      assert.equal(wrapper.getAttribute('aria-valuemin'), '0');
      assert.equal(wrapper.getAttribute('aria-valuemax'), '100');
    });
  });

  describe('goTo', function () {
    it('should be a function', function () {
      assert.equal(typeof prog.goTo, 'function');
    });

    it('should ensure the wrapper is visible', function () {
      prog.goTo(33);
      assert(prog.wrapper.classList.contains('progresso-show'));
    });

    it('should properly set the width of the fill', function () {
      var amount = 75;
      prog.goTo(amount);
      assert.equal(prog.fill.style.width, [amount, '%'].join(''));
    });

    it('should properly update aria-valuenow', function () {
      var amount = 11;
      prog.goTo(amount);
      assert.equal(prog.wrapper.getAttribute('aria-valuenow'), amount);
    });

    it('should stop at 100', function () {
      prog.goTo(9999999999999999999);
      assert.equal(prog.wrapper.getAttribute('aria-valuenow'), 100);
      assert.isFalse(prog.going);
      assert.equal(prog.currentValue, 100);
    });

    it('should trigger complete (after 400ms) once 100 is reached', function (done) {
      prog.on('complete', function () {
        prog.off('complete'); // detach so subsequent tests don't fire done
        done();
      });
      prog.goTo(100);
    });

    it('should properly update `currentValue`', function () {
      var n = 23;
      prog.goTo(n);
      assert.equal(prog.currentValue, n);
    });

    it('should trigger change', function (done) {
      prog.on('change', function () {
        prog.off('change');
        done();
      });

      prog.goTo(2);
    });
  });

  describe('increment', function () {
    it('should move progress to sum of current value and argument', function () {
      prog.goTo(50);
      prog.increment(1);
      assert.equal(prog.currentValue, 51);
      assert.equal(prog.wrapper.getAttribute('aria-valuenow'), '51');
      assert.equal(prog.fill.style.width, '51%');
      prog.increment(11);
      assert.equal(prog.currentValue, 62);
      assert.equal(prog.wrapper.getAttribute('aria-valuenow'), '62');
      assert.equal(prog.fill.style.width, '62%');
    });
  });

  describe('start', function () {
    it('should set `going` to true', function (done) {
      prog.start();
      setTimeout(function () {
        assert.isTrue(prog.going);
        prog.pause();
        done();
      });
    });
    // TODO: somehow test the random increment at random interval...
  });

  describe('pause', function () {
    it('should pause', function (done) {
      prog.start();
      setTimeout(function () {
        prog.pause();
        assert.isFalse(prog.going);
        done();
      });
    });
  });

  describe('done', function () {
    it('should go to 100 and pause', function () {
      prog.goTo(10);
      prog.done();
      assert.isFalse(prog.going);
      assert.equal(prog.currentValue, 100);
    });
  });

  describe('show', function () {
    it('should add the show class', function () {
      prog.show();
      assert.isTrue(prog.wrapper.classList.contains('progresso-show'));
    });
  });

  describe('hide', function () {
    it('should remove the show class', function () {
      prog.show().hide();
      assert.isFalse(prog.wrapper.classList.contains('progresso-show'));
    });
  });

  describe('events', function () {
    describe('on', function () {
      it('should set the callback as events[eventType]', function () {
        var fn = function () {};
        prog.on('foo', fn);
        assert.equal(prog.events.foo, fn);
      });
    });

    describe('off', function () {
      it('should remove the event from prog.events', function () {
        var fn = function () {};
        prog.on('bar', fn);
        assert.equal(prog.events.bar, fn);
        prog.off('bar')
        assert.isNull(prog.events.bar);
      });
    });
  });
});