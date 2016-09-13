# Progresso
Top bar progress bar loader (like youtube and github and many others use)

## Installation
```bash
$ bower install progresso
```

## Usage
Just include `progresso.css` and `progresso.js`.

```html
<link rel='stylesheet' href='bower_components/progresso.css' />
<script src="bower_components/progresso.js"></script>
<script>
var progress = new Progresso();
progress.start();
</script>
```

## Options
* `focus` (_Boolean_): Whether or not to focus the progress bar when loading starts
  * Defaults to `true`
* `hideClass` (_String_): Class to be added to the progress bar when it is hidden
* `showClass` (_String): Class to be added when progress bar is showing
  * Defaults to `"progresso-show"`
* `wrapperClass` (_String_): Class to be added to the wrapper element (`Progresso.wrapper`)
  * Defaults to `"progresso-wrap`
* `fillClass` (_String_): Class to be added to the fill element (`Progresso.fill`)
  * Defaults to `"progresso-fill"`

## Methods
* `Progresso#goTo`: Accepts a number (0 - 100) in which the progress bar will go to (%). Example: `progress.goTo(5); // set the progress bar to 5%`
* `Progresso#start`: Randomly increments the progress (random interval time and random progress increment).
* `Progresso#pause`: Pause the progress bar in it's current state
* `Progresso#done`: Sets the progress to 100%.  Call when stuff is done loading.

## Events
Add an event listener with `.on`, remove event listener with `.off` (see example below)
* `complete`: fires when the progress reaches 100%
* `change`: fires when progress changes

```js
var progresso = new Progresso();

progresso
  .on('change', function () {
    console.log('stuff has changed and stuff');
  })
  .on('complete', function () {
    console.log('loading complete!');
    progresso.off('change');
  });
```

All events/methods are chainable meaning you can:
```js
progresso.start().goTo(50).pause().goTo(55).done();
```

## Running tests
```bash
$ gulp test
```