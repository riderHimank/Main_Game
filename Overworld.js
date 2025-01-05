class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;
  }

  gameLoopStep() {
    //Clear off the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    //Establish the camera person
    const cameraPerson = this.map.gameObjects.hero;

    //Update all objects
    Object.values(this.map.gameObjects).forEach((object) => {
      object.update({
        arrow: this.directionInput.direction,
        map: this.map,
      });
    });

    //Draw Lower layer
    this.map.drawLowerImage(this.ctx, cameraPerson);

    //Draw Game Objects
    Object.values(this.map.gameObjects)
      .sort((a, b) => {
        return a.y - b.y;
      })
      .forEach((object) => {
        object.sprite.draw(this.ctx, cameraPerson);
      });

    //Draw Upper layer
    this.map.drawUpperImage(this.ctx, cameraPerson);
  }

  startGameLoop() {
    let previousMs;
    const step = 1 / 90;

    const stepFn = (timestampMs) => {
      if (previousMs === undefined) {
        previousMs = timestampMs;
      }
      let deltaMs = (timestampMs - previousMs) / 1000;
      while (deltaMs >= step) {
        this.gameLoopStep();
        deltaMs -= step;
      }
      previousMs = timestampMs - deltaMs * 1000;

      requestAnimationFrame(stepFn);
    };
    requestAnimationFrame(stepFn);
  }

  bindActionInput() {
    new KeyPressListener("Enter", () => {
      //Is there a person here to talk to?
      this.map.checkForActionCutscene();
    });
  }

  bindHeroPositionCheck() {
    document.addEventListener("PersonWalkingComplete", (e) => {
      if (e.detail.whoId === "hero") {
        //Hero's position has changed
        this.map.checkForFootstepCutscene();
      }
    });
  }

  startMap(mapConfig) {
    this.map = new OverworldMap(mapConfig);
    this.map.overworld = this;
    this.map.mountObjects();
  }

  reStartMap(mapConfig) {
    this.map = new OverworldMap(mapConfig);
    this.map.overworld = this;
    // this.map.mountObjects();
    Object.keys(this.map.gameObjects).forEach((key) => {
      let object = this.map.gameObjects[key];
      if (key === "hero") {
        object.x = origin.x;
        object.y = origin.y;
      }
      object.id = key;

      //TODO: determine if this object should actually mount
      object.mount(this.map);
    });
    this.map.startTimer();
  }

  init() {
    this.startMap(window.OverworldMaps.DemoRoom);

    this.bindActionInput();
    this.bindHeroPositionCheck();

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();

    this.map.startCutscene([
      {
        type: "textMessage2",
        text: "Start Game",
        map: "DemoRoom",
      },
    ]);
  }
}
