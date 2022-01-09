import { sceneData } from "../sceneData.js";
import { MenuScene } from "./MenuScene.js";

export class LoadScene extends Phaser.Scene {
  constructor() {
    super({
      key: sceneData.scenes.load,
    });
  }

  init(data) { }

  preload() {
    // load image, spritesheet, sound
    this.load.image("title_bg", "./src/assets/image/title_bg.jpg");
    this.load.image("options_button", "./src/assets/image/options_button.png");
    this.load.image("play_button", "./src/assets/image/play_button.png");
    this.load.image("logo", "./src/assets/image/logo.png");

    this.load.spritesheet("cat", "./src/assets/sprite/cat.png", {
      frameHeight: 32,
      frameWidth: 32,
    });

    this.load.audio("title_music", "./src/assets/audio/shuinvy-childhood.mp3");

    // create loading bar
    let loadingBar = this.add.graphics({
      fillStyle: {
        color: 0xffffff, // white
      },
    });

    // simulate large load
    for (let i = 0; i < 100; i++) {
      this.load.spritesheet("cat" + i, "./src/assets/sprite/cat.png", {
        frameHeight: 32,
        frameWidth: 32,
      });
    }

    this.load.on("progress", (percent) => {
      loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50);
      console.log(percent);
    });

    this.load.on("complete", () => {
      console.log("done");
      // this.scene.add(sceneData.scenes.menu, MenuScene, false); // auto start = false
      // this.scene.start(sceneData.scenes.menu, "hello from load scene");
    });

    this.load.on("load", (file) => {
      console.log(file.src);
      console.log(file);
    });
  }

  create() {
    this.scene.add(sceneData.scenes.menu, MenuScene, false); // auto start = false
    this.scene.start(sceneData.scenes.menu);
  }
}
