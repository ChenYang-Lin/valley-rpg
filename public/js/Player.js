import MatterEntity from "./MatterEntity.js";
import Inventory from "./Inventory.js";

export default class Player extends MatterEntity {
    constructor(data) {
        let { scene, x, y, texture, frame } = data;
        super({ ...data, health: 20, drops: [], name: "player" });
        this.scene = scene;
        this.touching = [];
        this.direction = data.direction || "right";
        this.attacking = false;
        this.attackSpd = 0.25;
        this.attackCD = 0;
        this.weaponRotation = 0;
        this.setScale(.5); // change from 64 x 64 to 32 x 32;

        this.inventory = new Inventory();

        // JoyStick movement
        this.joyLeft = false;
        this.joyRight = false;
        this.joyUp = false;
        this.joyDown = false;

        // Collision bodies
        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        let playerCollider = Bodies.circle(this.x, this.y + 10, 5, { isSensor: false, label: "playerCollider" });
        let playerSensor = Bodies.circle(this.x, this.y, 24, { isSensor: true, label: "playerSensor" });
        const compoundBody = Body.create({
            parts: [playerCollider, playerSensor],
            // frictionAir: 0.35,
        });
        this.setExistingBody(compoundBody);
        this.setFixedRotation();

        // Resource Collisions
        this.changeSceneCollisions(playerCollider);
        this.createPickupCollisions(playerCollider);
        this.createMiningCollisions(playerSensor);

        // Weapon
        this.spriteWeapon = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'items', 162);
        this.spriteWeapon.setScale(0.8);
        this.spriteWeapon.setOrigin(0.25, 0.50);
        this.spriteWeapon.setDepth(1);
        this.scene.add.existing(this.spriteWeapon);


    }

    static preload(scene) {
        // scene.load.atlas('female', 'assets/images/female.png', 'assets/images/female_atlas.json');
        // scene.load.animation("female_anim", "assets/images/female_anim.json");
        // Animation
        scene.load.atlas('player', 'assets/img/player/player.png', 'assets/img/player/player_atlas.json');
        scene.load.animation("player_anim", "assets/img/player/player_anim.json");
        scene.load.spritesheet("items", "assets/images/items.png", { frameWidth: 32, frameHeight: 32 });
        // Audios
        scene.load.audio('player', 'assets/audio/player.mp3');

    }

    update(time, delta, mouseActive) { // delta 16.666 @ 60fps
        // console.log(delta);

        // weapon move along with player
        this.spriteWeapon.setPosition(this.x, this.y);

        // Movement
        const tileSize = 32;
        let playerSpeed = 2;
        const speed = tileSize * playerSpeed;

        let playerVelocity = new Phaser.Math.Vector2();

        // Key down
        if (this.inputKeys.left.isDown || this.joyLeft)
            playerVelocity.x -= 1;
        if (this.inputKeys.right.isDown || this.joyRight)
            playerVelocity.x += 1;
        if (this.inputKeys.up.isDown || this.joyUp)
            playerVelocity.y -= 1;
        if (this.inputKeys.down.isDown || this.joyDown)
            playerVelocity.y += 1;

        playerVelocity.normalize();
        playerVelocity.scale(speed * (delta / 1000));
        this.setVelocity(playerVelocity.x, playerVelocity.y);

        // direction 
        if (playerVelocity.y > 0) {
            this.direction = "down";
        } else if (playerVelocity.y < 0) {
            this.direction = "up";
        }
        if (playerVelocity.x > 0) {
            this.direction = "right";
        } else if (playerVelocity.x < 0) {
            this.direction = "left";
        }

        // Animation
        if (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
            this.anims.play(`player_walk_${this.direction}`, true);
        } else {
            this.anims.play(`player_stand_${this.direction}`, true);
        }

        // Basic Attack
        // console.log(this.scene.input.activePointer)
        if (!this.attacking && this.scene.input.activePointer.isDown) {
            if (mouseActive)
                this.attack();
        }

        // Attack
        let timePassed = delta / 1000;
        if (this.attacking) {
            this.attackCD -= timePassed;
            let currRotation = (timePassed * (1 / this.attackSpd)) * 100;
            this.weaponRotation += currRotation;
            this.spriteWeapon.setAngle(this.weaponRotation);

            if (this.attackCD <= 0) {
                this.attacking = false;
                this.weaponRotation = 0;
                this.spriteWeapon.setAngle(this.weaponRotation);
                this.whackStuff();
            }
        }


    }

    whackStuff() {
        this.touching = this.touching.filter(gameObject => gameObject.hit && !gameObject.dead);
        this.touching.forEach(gameObject => {
            gameObject.hit();
            if (gameObject.dead) gameObject.destroy();
        })
    }

    joyStickUpdate(cursorKeys) {
        this.joyLeft = cursorKeys.left.isDown;
        this.joyRight = cursorKeys.right.isDown;
        this.joyUp = cursorKeys.up.isDown;
        this.joyDown = cursorKeys.down.isDown;

    }

    attack() {
        this.attacking = true;
        this.attackCD = this.attackSpd;


    }

    changeSceneCollisions(playerCollider) {
        this.scene.matterCollision.addOnCollideStart({
            objectA: [playerCollider],
            callback: other => {
                if (other.gameObjectB && other.gameObjectB.nextScene) {
                    this.scene.scene.start(other.gameObjectB.nextScene);
                }
            }
        })
    }

    createPickupCollisions(playerCollider) {
        this.scene.matterCollision.addOnCollideStart({
            objectA: [playerCollider],
            callback: other => {
                // console.log("start");
                if (other.gameObjectB && other.gameObjectB.pickup) {
                    if (other.gameObjectB.pickup()) {
                        this.inventory.addItem({ name: other.gameObjectB.name, quantity: 1 })
                        console.log("picked up: " + other.gameObjectB.name);
                    }
                }
            },
            context: this.scene,
        })
    }

    createMiningCollisions(playerSensor) {
        this.scene.matterCollision.addOnCollideStart({
            objectA: [playerSensor],
            callback: other => {
                if (other.bodyB.isSensor) return;
                this.touching.push(other.gameObjectB);
                // console.log(this.touching.length, other.gameObjectB.name)
            },
            context: this.scene,
        })

        this.scene.matterCollision.addOnCollideEnd({
            objectA: [playerSensor],
            callback: other => {
                this.touching = this.touching.filter(gameObject => gameObject != other.gameObjectB);
                // console.log(this.touching.length);
            },
            context: this.scene,
        })
    }
}