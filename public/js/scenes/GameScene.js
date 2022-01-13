import Player from "../Player.js";
import Resource from "../Resource.js";
import { setCurrScene } from "../utils/utils.js";

export default class GameScene extends Phaser.Scene {
    constructor() {
        const name = "Valley"
        super(name + "Scene");
        this.name = name + "Scene";
        this.tilemapKey = name;

        this.sceneChangers = [];
        this.camera;
        this.inRange = true;
        this.mouseActive = true;
        this.isInventoryOpen = false;
    }

    preload() {

    }

    create() {
        console.log("current scene: ", this.name);
        setCurrScene(this.name);

        // Cursor Rectangle  
        this.cursorRect = new Phaser.Physics.Matter.Sprite(this.matter.world, 0, 0, "items", 11);
        // this.cursorRect.tint = 0xff0000;
        this.cursorRect.tint = 0x00ff00;
        this.cursorRect.setDepth(10);
        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        let cursorSensor = Bodies.rectangle(1, 1, 30, 30, { isSensor: true, label: "cursorSensor" });
        this.cursorRect.setExistingBody(cursorSensor);
        this.add.existing(this.cursorRect);

        this.matterCollision.addOnCollideStart({
            objectA: [cursorSensor],
            callback: other => {
                if (this.inRange === false) return;
                if (other.gameObjectB && other.gameObjectB.category) {
                    if (other.gameObjectB.category === "Resource") {
                        console.log(other.gameObjectB);
                    }
                    // this.scene.scene.start(other.gameObjectB.nextScene);
                }
            }
        })

        // Tilemap
        const map = this.make.tilemap({ key: this.tilemapKey });
        console.log(map)
        this.map = map;
        const tileset = map.addTilesetImage("RPG Nature Tileset", "tiles");
        let base = map.createLayer("Base", tileset, 0, 0);
        base.setCollisionByProperty({ collides: true });
        this.matter.world.convertTilemapLayer(base);

        // Resources
        const resources = this.map.getObjectLayer("Resources");
        Object.values(resources.objects).sort((a, b) => {
            return a.y - b.y;
        }).forEach(resource => {
            new Resource({ scene: this, resource });
        });

        // Player
        this.player = new Player({ scene: this, x: 100, y: 100 });
        this.player.inputKeys = this.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
        })

        // Camera 
        this.camera = this.cameras.main;
        this.camera.startFollow(this.player);
        this.camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);


        // Scene Changers
        const changers = this.map.getObjectLayer("SceneChanger");
        changers.objects.forEach(changer => {
            let changerObject = new Phaser.Physics.Matter.Sprite(this.matter.world, changer.x, changer.y, "resources", "bush");
            changerObject.nextScene = JSON.parse(changer.properties.find(p => p.name == "scene").value);
            this.add.existing(changerObject);
        })


        // Test change scene
        // this.input.keyboard.on("keydown-E", () => {
        //     this.scene.start("MenuScene");
        // })
        this.input.keyboard.on("keydown-E", () => {
            // this.crafting.craft();
            console.log("E key down")
            this.mouseActive = !this.mouseActive;
        })

        // Player Input - Expand Inventory
        this.input.keyboard.on("keydown-B", () => {
            // this.rows = this.rows === 1 ? this.maxRows : 1;
            // this.refresh();
            if (this.isInventoryOpen) {
                this.isInventoryOpen = false;
                this.scene.stop("InventoryWindow");
            } else {
                this.isInventoryOpen = true;
                this.scene.launch("InventoryWindow", { mainScene: this });
            }
        })


        // JoyStick
        // this.joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
        //     x: 60,
        //     y: this.game.renderer.height - 60,
        //     radius: 30,
        //     base: this.add.circle(0, 0, 40, 0x888888, 0.8),
        //     thumb: this.add.circle(0, 0, 20, 0xcccccc, 0.8),
        //     // dir: '8dir',
        //     forceMin: 0,
        //     // fixed: true,
        //     // enable: true

        // })
        //     .on('update', this.dumpJoyStickState, this)
        // this.joyStick.base.setDepth(10);
        // this.joyStick.thumb.setDepth(10);

    }

    dumpJoyStickState() {
        var cursorKeys = this.joyStick.createCursorKeys();
        this.player.joyStickUpdate(cursorKeys);
    }

    update(number, delta) {
        // this.enemies.forEach(enemy => enemy.update());
        this.player.update(number, delta, this.mouseActive);

        // Mouse position
        let x, y;
        if (this.mouseActive) {
            x = this.input.mousePointer.x + this.camera.worldView.x;
            y = this.input.mousePointer.y + this.camera.worldView.y;

        } else {
            x = this.player.x;
            y = this.player.y;
        }
        let offsetX = x % 32;
        let offsetY = y % 32;
        x = x - offsetX + 16;
        y = y - offsetY + 16;
        this.cursorRect.x = x;
        this.cursorRect.y = y;
        // Valid input - cursor color
        if (Math.abs(this.player.x - x) < 32 && Math.abs(this.player.y - y) < 32) {
            this.inRange = true;
            this.cursorRect.tint = 0x00ff00;
        }
        else {
            this.inRange = false;
            this.cursorRect.tint = 0xff0000;
        }

    }
}