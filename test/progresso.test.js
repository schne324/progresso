'use strict';

/* global Progresso */
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

    it('should ensure visibility by calling show', function () {
      prog.hide().start();
      assert(prog.wrapper.classList.contains('progresso-show'));
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
        prog.off('bar');
        assert.isNull(prog.events.bar);
      });
    });
  });

  describe('options', function () {
    var progWithOpts, progWithDefaults;

    before(function () {
      progWithOpts = new Progresso({
        focus: true,
        hideClass: 'boognish',
        showClass: 'show',
        wrapperClass: 'wrapper',
        fillClass: 'fill',
        text: {
          class: 'offscreener',
          content: 'Yo the loading is like $1 percent completed'
        }
      });

      progWithDefaults = new Progresso();
    });

    after(function () {
      progWithOpts.pause().hide();
      progWithDefaults.pause().hide();
    });

    describe('focus', function () {
      it('should add tabindex="-1" to the wrapper', function () {
        assert.equal(progWithOpts.wrapper.tabIndex, -1);
      });

      it('should focus the wrapper when `start` is called', function () {
        progWithOpts.start();
        assert.equal(document.activeElement, progWithOpts.wrapper);
      });
    });

    describe('hideClass', function () {
      it('should add the hide class when `hide` is called', function () {
        progWithOpts.hide();
        assert.isTrue(progWithOpts.wrapper.classList.contains('boognish'));
      });

      it('should remove the hide class when `show` is called', function () {
        progWithOpts.hide().show();
        assert.isFalse(progWithOpts.wrapper.classList.contains('boognish'));
      });
    });

    describe('showClass', function () {
      it('should add the show class when `show` is called', function () {
        progWithOpts.hide().show();
        assert.isTrue(progWithOpts.wrapper.classList.contains('show'));
      });

      it('should remove the show class when `hide` is called', function () {
        progWithOpts.show().hide();
        assert.isFalse(progWithOpts.wrapper.classList.contains('show'));
      });

      it('should default to "progresso-show"', function () {
        progWithDefaults.show();
        assert.isTrue(progWithDefaults.wrapper.classList.contains('progresso-show'));
      });
    });

    describe('wrapperClass', function () {
      it('should add the wrapperClass to the wrapper', function () {
        assert.isTrue(progWithOpts.wrapper.classList.contains('wrapper'));
      });

      it('should default to "progresso-wrap"', function () {
        assert.isTrue(progWithDefaults.wrapper.classList.contains('progresso-wrap'));
      });
    });

    describe('fillClass', function () {
      it('should add the fillClass to the fill element', function () {
        assert.isTrue(progWithOpts.fill.classList.contains('fill'));
      });

      it('should default to "progresso-fill"', function () {
        assert.isTrue(progWithDefaults.fill.classList.contains('progresso-fill'));
      });
    });

    describe('text', function () {
      it('should create the element', function () {
        assert.equal('object', typeof progWithDefaults.wrapper.querySelector('.progresso-offscreen'));
      });

      it('should store the element as instance.offscreen', function () {
        var t = progWithDefaults.wrapper.querySelector('.progresso-offscreen');
        assert.equal(t, progWithDefaults.offscreen);
      });

      it('should add the right text / class (default)', function () {
        progWithDefaults.goTo(57);
        assert.equal('Loading 57% complete', progWithDefaults.offscreen.innerHTML);
        assert.isTrue(progWithDefaults.fill.classList.contains('progresso-fill'));
      });

      it('should add the right text / class (options passed in)', function () {
        progWithOpts.goTo(77);
        assert.equal(progWithOpts.offscreen.innerHTML, 'Yo the loading is like 77 percent completed');
        assert.isTrue(progWithOpts.offscreen.classList.contains('offscreener'));
        progWithOpts.hide();
      });
    });
  });
});
