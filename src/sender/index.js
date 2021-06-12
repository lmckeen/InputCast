import { Gam3pad } from 'gam3pad'

export class InputCast {
  #isConnected = false
  #gamepadInterceptors = {}
  #keyboardInterceptors = {}
  #session
  #gamepad

  constructor() {
    const player = new cast.framework.RemotePlayer()
    const controller = new cast.framework.RemotePlayerController(player);
    const context = cast.framework.CastContext.getInstance()
    const remotePlayerEventType = cast.framework.RemotePlayerEventType

    this.#gamepad = new Gam3pad()
    this.#setupConnectedEvents()
    
    controller.addEventListener(remotePlayerEventType.IS_CONNECTED_CHANGED, event => {
      this.#isConnected = event.value
      if (!this.#isConnected) return 

      this.#session = context.getCurrentSession()
    })

    document.addEventListener('keydown', async event => {
      if (!this.#isConnected) return

      const {
        altKey,
        ctrlKey,
        metaKey,
        shiftKey,
        key,
        code,
        repeat,
        location
      } = event

      let keyboardEvent = {
        altKey,
        ctrlKey,
        metaKey,
        shiftKey,
        key,
        code,
        repeat,
        location,
        preventDefault: () => {
          event.preventDefault()
        }
      }

      keyboardEvent = await this.#sendInterceptor(
        code,
        keyboardEvent,
        this.#keyboardInterceptors
      )
      
      this.#sendKeyboardInput(keyboardEvent)
    })

    this.#gamepad.on(Gam3pad.INPUT.ALL, event => {
      if (!this.#isConnected) return 
 
      const buttons = event.buttons.map(data => {
        const buttonEvent = this.#sendInterceptor(
          data.type,
          data,
          this.#gamepadInterceptors
        )

        return buttonEvent
      })

      const joysticksEvent = this.#sendInterceptor(
        Gam3pad.INPUT.JOYSTICKS,
        event.joysticks,
        this.#gamepadInterceptors
      )

      Promise.all([Promise.all(buttons), joysticksEvent]).then(([buttons, joysticks]) => {
        this.#sendGamepadInput({
          buttons,
          joysticks
        })
      })
    })
  }
  
  static INPUT = Gam3pad.INPUT
  
  onBeforeGamepad(type, cb) {
    this.#gamepadInterceptors[type] = cb
  }
  
  onBeforeKeyboard(type, cb) {
    this.#keyboardInterceptors[type] = cb
  }
  
  #sendInterceptor(type, data, arr) {
    if (!data) return
    
    if (arr[Gam3pad.INPUT.ALL]) {
      data = arr[Gam3pad.INPUT.ALL](data)
    }
  
    if (arr[type]) {
      data = arr[type](data)
    }
    
    return data
  }

  #sendGamepadInput(event) {
    this.#session.sendMessage('urn:x-cast:com.inputcast.gamepad', event)
  }
  
  #sendKeyboardInput(event) {
    this.#session.sendMessage('urn:x-cast:com.inputcast.keyboard', event)
  }

  #generateGamepadToSend(gamepad) {
    const {
      id,
      connected,
      index,
      mapping,
      timestamp
    } = gamepad

    return {
      id,
      connected,
      index,
      mapping,
      timestamp
    }
  }

  #setupConnectedEvents() {
    this.#gamepad.on(Gam3pad.INPUT.CONNECTED, async event => {
      const connectedEvent = await this.#sendInterceptor(
        Gam3pad.INPUT.CONNECTED,
        this.#generateGamepadToSend(event.gamepad),
        this.#gamepadInterceptors
      )
      this.#sendGamepadInput(connectedEvent)
    })

    this.#gamepad.on(Gam3pad.INPUT.DISCONNECTED, async event => {
      const disconnectedEvent = await this.#sendInterceptor(
        Gam3pad.INPUT.DISCONNECTED,
        this.#generateGamepadToSend(event.gamepad),
        this.#gamepadInterceptors
      )
      this.#sendGamepadInput(disconnectedEvent)
    })
  }
}