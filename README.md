# InputCast

Keyboard and Controller support for Chromecast

<br>

## How to use InputCast


```
npm install inputcast
```

### Sender 
```js
import { InputCast } from 'inputcast/sender'

window['__onGCastApiAvailable'] = function(isAvailable) {
  if (isAvailable) {
    const inputCast = new InputCast()
    
    inputCast.onBeforeGamepad(InputCast.INPUT.R2, event => {
      return event
    })
    
    inputCast.onBeforeKeyboard(InputCast.INPUT.ALL, event => {
      return event
    })
  }
}
```

### Receiver
```js
import { InputCast } from 'inputcast/receiver'

const inputCast = new InputCast()

inputCast.onGamepad(InputCast.INPUT.R2, event => {
  console.log(event) 
})

inputCast.onKeyboard(InputCast.INPUT.ALL, event => {
  console.log(event) 
})
```
<br>

## API Docs

### Sender

```js
//Gamepad interceptor that allows modifying or 
//adding data before being sent to the receiver
onBeforeGamepad(
  type: string,
  cb: (event: GamepadEvent) => Promise<GamepadEvent> | GamepadEvent
)

//Keyboard interceptor that allows modifying or 
//adding data before being sent to the receiver
//This event data also includes a `preventDefault` 
//function that if called will stop the event from 
//propagating to the sender
onBeforeGamepad(
  type: string, 
  cb: (event: KeyboardEvent) => Promise<KeyboardEvent> | KeyboardEvent
)
```

### Receiver

```js
//Event listener for gamepad events
onGamepad(
  type: string,
  cb: (event: GamepadEvent) => void
)

//Event listener for keyboard events
onGamepad(
  type: string,
  cb: (event: KeyboardEvent) => void
)
```

<br> 

## Available types

### Gamepad
InputCast supports all of the available types in the below repo<br>
https://github.com/lmckeen/Gam3pad#available-types

### Keyboard
```js
InputCast.INPUT.ALL
```
InputCast also supports all KeyboardEvent types by their respective string based code value<br>
https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code/code_values

<br>

## Demo

### Live 
https://lukemckeen.com/InputCast-Demo/dist/sender


### Repo
https://github.com/lmckeen/InputCast-Demo
