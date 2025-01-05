class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;
  }

  startGameLoop() {
    const step = () => {
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

      requestAnimationFrame(() => {
        step();
      });
    };
    step();
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

    // this.map.startCutscene([
    //   { who: "hero", type: "walk",  direction: "down" },
    //   { who: "hero", type: "walk",  direction: "down" },
    //   { who: "npcA", type: "walk",  direction: "up" },
    //   { who: "npcA", type: "walk",  direction: "left" },
    //   { who: "hero", type: "stand",  direction: "right", time: 200 },
    //   { type: "textMessage", text: "WHY HELLO THERE!"}
    //   // { who: "npcA", type: "walk",  direction: "left" },
    //   // { who: "npcA", type: "walk",  direction: "left" },
    //   // { who: "npcA", type: "stand",  direction: "up", time: 800 },
    // ])
    this.map.startCutscene([
      {
        type: "textMessage2",
        text: "Start Game",
        map: "DemoRoom",
      },
    ]);
  }
}
