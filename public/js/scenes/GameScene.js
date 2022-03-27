import Player from "../Player.js";
import Resource from "../Resource.js";
import Structure from "../Structure.js";
import Enemy from "../Enemy.js";
import { setCurrScene, getMobile } from "../utils/utils.js";
import { enemies } from "../utils/enemies.js";

export default class GameScene extends Phaser.Scene {
  constructor(name) {
    super(name + "Scene");
    this.name = name + "Scene";
    this.tilemapKey = name;

    this.enemies = [];
    this.sceneChangers = [];
    this.camera;
    this.inRange = true;
    this.mouseActive = true;
    this.isInventoryOpen = false;
    this.isShopOpen = false;
    this.isMobile = getMobile();
    
  }

  preload() {}

  create() {
    this.socket = io();

    this.otherPlayers = new Map();

    console.log("current scene: ", this.name);
    setCurrScene(this.name);

    // // Cursor Rectangle
    // this.cursorRect = new Phaser.Physics.Matter.Sprite(this.matter.world, 0, 0, "items", 11);
    // // this.cursorRect.tint = 0xff0000;
    // this.cursorRect.tint = 0x00ff00;
    // this.cursorRect.setDepth(10);
    
    // const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    // let cursorSensor = Bodies.rectangle(1, 1, 30, 30, { isSensor: true, label: "cursorSensor" });
    // this.cursorRect.setExistingBody(cursorSensor);
    // this.add.existing(this.cursorRect);

    // this.matterCollision.addOnCollideStart({
    //   objectA: [cursorSensor],
    //   callback: (other) => {
    //     if (this.inRange === false) return;
    //     if (other.gameObjectB && other.gameObjectB.category) {
    //       if (other.gameObjectB.category === "Resource") {
    //         console.log(other.gameObjectB);
    //       }
    //       // this.scene.scene.start(other.gameObjectB.nextScene);
    //     }
    //   },
    // });

    // Tilemap
    let map = this.make.tilemap({ key: this.tilemapKey });
    // console.log(map);
    // console.log(map.objects);
    // const resourceLayer = map.objects.find((o) => o.name === "Resources");
    // let resObject = resourceLayer.objects[0];
    // let resourceA = resObject;
    // if (resourceA) {
    //   resourceA.x = 50;
    //   resourceA.y = 50;
    // }
    // let newArray = [];
    // newArray.push(resourceA);
    // map.objects.forEach((element, index) => {
    //   if (element.name === "Resources" && newArray) {
    //     map.objects[index].objects = newArray;
    //   }
    // });

    // console.log(map);

    this.map = map;

    const tileset = map.addTilesetImage("all_tileset", "all_tileset");
    
    let base = map.createLayer("Base", tileset, 0, 0);
    base.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(base);

    let base2 = map.createLayer("Base2", tileset, 0, 0);
    base2.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(base2);


    // Resources
    const resources = this.map.getObjectLayer("Resource");
    Object.values(resources.objects)
      // .sort((a, b) => {
      //   return a.y - b.y;
      // })
      .forEach((resource) => {
        new Resource({ scene: this, resource });
      });

    const structures = this.map.getObjectLayer("Structure");
    Object.values(structures.objects)
      .forEach((structure) => {
        new Structure({ scene: this, structure });
      });

    // Scene Changers
    const changers = this.map.getObjectLayer("SceneChanger");
    changers.objects.forEach((changer) => {
      let changerObject = new Phaser.Physics.Matter.Sprite(this.matter.world, changer.x, changer.y-32, "resources", "bush").setAlpha(0);
      changerObject.nextScene = changer.properties.find((p) => p.name == "scene").value;
      this.add.existing(changerObject);
    });

    // Enemies
    // console.log(enemies)
    this.enemies = []
    enemies.forEach(enemy => {
        this.enemies.push(new Enemy({ scene: this, enemy }));
    })

    // temp player, 
    // this.player = new Player({ scene: this, isMainPlayer: true, x: playerInfo.x, y: playerInfo.y, texture:"player", frame:"player_stand_down" });    
    this.player = new Player({ scene: this, isMainPlayer: true, x: 100, y: 100, texture:"player", frame:"player_stand_down" });
    
    this.player.inputKeys = this.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
    });

    // Camera
    this.camera = this.cameras.main;
    // this.camera.startFollow(this.player);
    this.camera.startFollow(this.player, false);
    this.camera.setLerp(0.3, 0.3);
    // this.camera.zoom = 2;
    this.camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

    // Test change scene
    // this.input.keyboard.on("keydown-E", () => {
    //     this.scene.start("MenuScene");
    // })
    this.input.keyboard.on("keydown-E", () => {
      // this.crafting.craft();
      console.log("E key down");
      this.mouseActive = !this.mouseActive;
    });

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
    });

    // Shop 
    this.input.keyboard.on("keydown-P", () => {
      if (this.isShopOpen) {
        this.isShopOpen = false;
        this.scene.stop("ShopWindow");
      } else {
        this.isShopOpen = true;
        this.scene.launch("ShopWindow", { mainScene: this });
      }
    })

    // Get player depth 
    this.input.keyboard.on("keydown-Z", () => {
      console.log(this.player.depth)
    })

    // Get mouse position
    this.input.keyboard.on("keydown-X", () => {
      console.log(this.input.mousePointer.x, this.input.mousePointer.y)
    })

    // JoyStick
    if (this.isMobile) {
      this.joyStick = this.plugins
        .get("rexvirtualjoystickplugin")
        .add(this, {
          x: 60,
          y: this.game.renderer.height - 60,
          radius: 30,
          base: this.add.circle(0, 0, 40, 0x888888, 0.8),
          thumb: this.add.circle(0, 0, 20, 0xcccccc, 0.8),
          // dir: '8dir',
          forceMin: 0,
          // fixed: true,
          // enable: true
        })
        .on("update", this.dumpJoyStickState, this);
      this.joyStick.base.setDepth(10);
      this.joyStick.thumb.setDepth(10);
    }


    // listen for web socket events
    this.socket.on("currentPlayers", (players) => {
        // Object.keys(players) => expected output: Array [player1, player2, player3]
        Object.keys(players).forEach((id) => {
            if (players[id].playerId === this.socket.id) {
                // console.log(players[id])
                this.createPlayer(players[id]);
            } else {
                // this.addOtherPlayers(players[id]);
            }
        })
    })

    // // other player join
    // this.socket.on('newPlayer', (playerInfo) => {
    //     console.log("new player joined")
    //     this.addOtherPlayers(playerInfo);
    // });


    // this.socket.on("disconnected", (playerId) => {
    //   this.otherPlayers.get(playerId).destroyAll();
    //   this.otherPlayers.delete(playerId)
    // })

    // // other player move
    // this.socket.on('playerMoved', (playerInfo) => {
    //     console.log("player moved")
    //     // this.otherPlayers.get(playerInfo.playerId).setPosition(playerInfo.x, playerInfo.y);
    //     this.otherPlayers.get(playerInfo.playerId).updatePosition(playerInfo.x, playerInfo.y);
    // });
        
    // end socket listening
  }

  createPlayer(playerInfo) {
    // Player
    this.player.x = playerInfo.x
    this.player.y = playerInfo.y
  }

  addOtherPlayers(playerInfo) {
    const otherPlayer = new Player({ scene: this, isMainPlayer: false, x: playerInfo.x, y: playerInfo.y, texture:"player", frame:"player_stand_down" });
    otherPlayer.setTint(Math.random() * 0xffffff);
    otherPlayer.updatePosition(playerInfo.x, playerInfo.y)
    this.otherPlayers.set(playerInfo.playerId, otherPlayer);
  }

  dumpJoyStickState() {
    var cursorKeys = this.joyStick.createCursorKeys();
    this.player.joyStickUpdate(cursorKeys);
  }

  update(number, delta) {
    // this.enemies.forEach(enemy => enemy.update());
    this.player.update(number, delta, this.mouseActive, this.socket);
    this.enemies.forEach(enemy => enemy.update());

    // // Mouse position
    // let x, y;
    // if (this.mouseActive) {
    //   x = this.input.mousePointer.x + this.camera.worldView.x;
    //   y = this.input.mousePointer.y + this.camera.worldView.y;
    // } else {
    //   x = this.player.x;
    //   y = this.player.y;
    // }
    // let offsetX = x % 32;
    // let offsetY = y % 32;
    // x = x - offsetX + 16;
    // y = y - offsetY + 16;
    // this.cursorRect.x = x;
    // this.cursorRect.y = y;
    // // Valid input - cursor color
    // if (Math.abs(this.player.x - x) < 32 && Math.abs(this.player.y - y) < 32) {
    //   this.inRange = true;
    //   this.cursorRect.tint = 0x00ff00;
    // } else {
    //   this.inRange = false;
    //   this.cursorRect.tint = 0xff0000;
    // }
    // console.log(this.input.mousePointer.x, this.input.mousePointer.y)
  }
}
