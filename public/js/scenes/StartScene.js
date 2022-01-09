import LoadScene from "./LoadScene.js";

export default class StartScene extends Phaser.Scene {
    constructor() {
        super({
            key: "StartScene",
        });
    }

    init(data) { }

    preload() {
        // load image, spritesheet, sound
        this.load.image("load_bg", "./assets/img/scenes/load_bg.png");
        this.load.image("title_bg", "./assets/img/scenes/title_bg.png");
        this.load.image("play_button", "./assets/img/scenes/play_button.png");

        this.load.spritesheet("cat", "./assets/img/scenes/cat.png", {
            frameHeight: 32,
            frameWidth: 32,
        });

    }

    create() {
        this.scene.add("LoadScene", LoadScene, false); // auto start = false
        this.scene.start("LoadScene");
    }
}
