import Player from "./Player.js";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }

    preload() {
        Player.preload(this);

        // Tilemap
        this.load.image("tiles", "assets/images/RPG Nature Tileset.png");
        // this.load.tilemapTiledJSON("map", "assets/images/map.json");
    }

    create() {

        // Player
        this.player = new Player({ scene: this, x: 100, y: 300, texture: 'female', frame: "townsfolk_f_idle_1" });
        this.player.inputKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        })
    }

    update() {
        // this.enemies.forEach(enemy => enemy.update());
        this.player.update();
    }
}