# Progresso
Top bar progress bar loader (like youtube and github and many others use)

## Installation
```bash
$ bower install progresso
```

## Usage
Just include `progresso.css` and `progresso.js`.

```html
<head>
  <link rel='stylesheet' href='bower_components/progresso.css' />
</head>
<body>
  <script src="bower_components/progresso.js"></script>
  <script>
  var progress = new Progresso();
  progress.start();
  </script>
</body>
```

## Options
* `focus` (_Boolean_): Whether or not to focus the progress bar when loading starts
  * Defaults to `false`
* `hideClass` (_String_): Class to be added to the progress bar when it is hidden
* `showClass` (_String): Class to be added when progress bar is showing
  * Defaults to `"progresso-show"`
* `wrapperClass` (_String_): Class to be added to the wrapper element (`Progresso.wrapper`)
  * Defaults to `"progresso-wrap`
* `fillClass` (_String_): Class to be added to the fill element (`Progresso.fill`)
  * Defaults to `"progresso-fill"`
* `text` (_Object_): The configuration object for the offscreen text within the loader (`Progresso.offscreen`)
  * `text.class`: The class to be added to the offscreen element within the wrapper
    * Defaults to `'progresso-offscreen'`
  * `text.content`: The text to be added to the offscreen element.  This text uses `$1` to be replaced with the given percent value of progress.
    * Defaults to `'Loading $1% complete'` (meaning when the progress bar is at 11%, the text content of the offscreen element would be `'Loading 11% complete'`)

### Example Progresso call with options

```js
var progress = new Progresso({
  focus: true,
  hideClass: 'hidden',
  showClass: 'showing',
  wrapperClass: 'progressbar-container', // NOTE: if you use different classes, you'll have to roll your own css or edit progresso.css
  fillClass: 'progressbar-fill',
  text: {
    class: 'sr-only',
    content: 'Page loading: $1'
  }
});
```


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
var progress = new Progresso();

progress
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
