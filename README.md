# Progresso
Top bar progress bar loader (like youtube and github and many others use)

## Installation
```bash
$ bower install progresso
```

## Usage
```html
<link rel='stylesheet' href='bower_components/progresso.css' />
<script src="bower_components/progresso.js"></script>
<script>
var progress = new Progresso();
progress.start();
</script>
```

## Public methods
* `Progresso#goTo`: Accepts a number (0 - 100) in which the progress bar will go to (%). Example: `progress.goTo(5); // set the progress bar to 5%`
* `Progresso#start`: Randomly increments the progress (random interval time and random progress increment).
* `Progresso#pause`: Pause the progress bar in it's current state
* `Progresso#done`: Sets the progress to 100%.  Call when stuff is done loading.

## Browser support
IE10+