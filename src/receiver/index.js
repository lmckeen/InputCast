import { Gam3pad } from 'gam3pad'

export class InputCast {
  #keyboardCallbacks = {}
  #gamepadCallbacks = {}
  #lastJoysticks
  
  constructor() {
    const context = cast.framework.CastReceiverContext.getInstance()
    
    context.addCustomMessageListener('urn:x-cast:com.inputcast.keyboard', ({ data }) => {
      this.#dispatchCallbacks(Gam3pad.INPUT.ALL, data, this.#keyboardCallbacks)
      this.#dispatchCallbacks(data.code, data, this.#keyboardCallbacks)
    })  
    
    context.addCustomMessageListener('urn:x-cast:com.inputcast.gamepad', ({ data }) => {
      data.buttons.forEach(({type, button}) => {
        this.#dispatchCallbacks(type, button, this.#gamepadCallbacks)
      })
      
      const newJoysticks = JSON.stringify(data.joysticks)
      
      if (this.#lastJoysticks !== newJoysticks) {
        this.#lastJoysticks = newJoysticks
        this.#dispatchCallbacks(Gam3pad.INPUT.JOYSTICKS, data.joysticks, this.#gamepadCallbacks)
      }
      
      this.#dispatchCallbacks(Gam3pad.INPUT.ALL, data, this.#gamepadCallbacks)
    })
  }
  
  static INPUT = Gam3pad.INPUT

  onGamepad(type, cb) {
    this.#gamepadCallbacks[type] = this.#gamepadCallbacks[type] || []
    this.#gamepadCallbacks[type].push(cb)
  }
  
  onKeyboard(type, cb) {
    this.#keyboardCallbacks[type] = this.#keyboardCallbacks[type] || []
    this.#keyboardCallbacks[type].push(cb)
  }

  #dispatchCallbacks(type, data, arr) {
    if (arr[type]?.length > 0) {
      arr[type].forEach(cb => {
        cb(data)
      })
    }
  }
}
