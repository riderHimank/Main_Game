class TextMessage {
  constructor({ text, onComplete , map }) {
    this.text = text;
    this.map = map;
    this.onComplete = onComplete;
    this.element = null;
  }

  createElement() {
    //Create the element
    this.element = document.createElement("div");
    this.element.classList.add("TextMessage");

    this.element.innerHTML = `
      <p class="TextMessage_p blink">${this.text}</p>
      <p class="TextMessage_p2">You have completed the game in ${this.map.recordTimeSpent()}!</p>
      <button class="TextMessage_button">Play Again</button>
      <a href="https://alcheringa.in" class="TextMessage_button_2">Exit</a>
    `;

    this.element.querySelector("button").addEventListener("click", () => {
      //Close the text message
      this.done();
    });

    this.actionListener = new KeyPressListener("Enter", () => {
      this.actionListener.unbind();
      this.done();
    })

  }

  done() {
    this.element.remove();
    this.onComplete();
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element)
  }

}

class TextMessage2 {
  constructor({ text, onComplete, map }) {
    this.text = text;
    this.map = map;
    this.onComplete = onComplete;
    this.element = null;
  }

  createElement() {
    //Create the element
    this.element = document.createElement("div");
    this.element.classList.add("TextMessage");

    this.element.innerHTML = `
      <p class="TextMessage_p2 blink">Click or Press Enter</p>
      <button class="TextMessage_button">Start Game</button>
    `;

    this.element.querySelector("button").addEventListener("click", () => {
      //Close the text message
      this.done();
    });

    this.actionListener = new KeyPressListener("Enter", () => {
      this.actionListener.unbind();
      this.done();
    });
  }

  done() {
    this.element.remove();
    this.onComplete();
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);
  }
}