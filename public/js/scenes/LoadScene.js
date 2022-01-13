import MenuScene from "./MenuScene.js";
import ValleyScene from "./ValleyScene.js";
import TownScene from "./TownScene.js";
import Player from "../Player.js";
import Resource from "../Resource.js";
import InventoryScene from "./InventoryScene.js";
import InventoryWindow from "./InventoryWindow.js";

export default class LoadScene extends Phaser.Scene {
    constructor() {
        super({
            key: "LoadScene",
        });
    }

    init(data) { }

    preload() {

        Player.preload(this);
        Resource.preload(this);

        // Inventory Images
        this.load.image("inventoryCloseBtn", "assets/img/scenes/Inventory/closeBtn.png");

        // Items
        this.load.spritesheet("items", "assets/img/items.png", { frameWidth: 32, frameHeight: 32 });

        // Tilemap
        this.load.image("tiles", "assets/img/maps/RPG Nature Tileset.png");
        this.load.tilemapTiledJSON("Valley", "assets/img/maps/valley.json");
        this.load.image("houseTiles", "assets/img/maps/house Tilesets.png");
        this.load.tilemapTiledJSON("Town", "assets/img/maps/town.json");

        // create loading bar
        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff, // white
            },
        }).setDepth(1);

        let bg = this.add.image(0, 0, "load_bg").setOrigin(0, 0).setDepth(0);
        bg.displayWidth = this.game.renderer.width;
        bg.displayHeight = this.game.renderer.height;

        // JoyStick plugin
        this.load.plugin('rexvirtualjoystickplugin', 'phaser/joystick/rexvirtualjoystickplugin.min.js', true);

        // simulate large load
        // for (let i = 0; i < 10; i++) {
        //     this.load.spritesheet("cat" + i, "./assets/img/scenes/cat.png", {
        //         frameHeight: 32,
        //         frameWidth: 32,
        //     });
        // }

        this.load.on("progress", (percent) => {
            loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50);
            // console.log(percent);
        });

        this.load.on("complete", () => {
            console.log("done");
            // this.scene.add(sceneData.scenes.menu, MenuScene, false); // auto start = false
            // this.scene.start(sceneData.scenes.menu, "hello from load scene");
            loadingBar.destroy();
            bg.destroy();
        });

        this.load.on("load", (file) => {
            // console.log(file.src);
            // console.log(file);
        });

    }

    create() {
        this.scene.add("MenuScene", MenuScene, false); // auto start = false
        this.scene.add("ValleyScene", ValleyScene, false); // auto start = false
        this.scene.add("TownScene", TownScene, false); // auto start = false
        this.scene.add("InventoryScene", InventoryScene, false); // auto start = false
        this.scene.add("InventoryWindow", InventoryWindow, false); // auto start = false
        // this.scene.start("MenuScene");
        this.scene.start("ValleyScene");
    }
}
