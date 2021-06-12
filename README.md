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
  //This event will contain the right trigger data when button pressed
  console.log(event) 
})

inputCast.onKeyboard(InputCast.INPUT.ALL, event => {
  //This event will contain a KeyboardEvent data object with depricated properties removed
  console.log(event) 
})
```
<br>

## API Docs

### Sender

```js
//Gamepad interceptor that allows modifying or adding data before being sent to the receiver
onBeforeGamepad(
  type: string,
  cb: (event: GamepadEvent) => Promise<GamepadEvent> | GamepadEvent
)

//Keyboard interceptor that allows modifying or adding data before being sent to the receiver
//This event data alow includes a `preventDefault` function that if called with stop it from also propagating to the sender
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

## Demo

### Live 
https://lukemckeen.com/InputCast-Demo/dist/sender


### Repo
https://github.com/lmckeen/InputCast-Demo
