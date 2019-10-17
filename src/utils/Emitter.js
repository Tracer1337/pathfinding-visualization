// Source: https://stackoverflow.com/questions/22186467/how-to-use-javascript-eventtarget
export default class Emitter {
  constructor() {
    var delegate = document.createDocumentFragment();
    [
      'addEventListener',
      'dispatchEvent',
      'removeEventListener'
    ].forEach(f =>
      this[f] = (...xs) => delegate[f](...xs)
    )
  }
}
