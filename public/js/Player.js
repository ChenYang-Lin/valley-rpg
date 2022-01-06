import MatterEntity from "./MatterEntity.js";


export default class Player extends MatterEntity {
    constructor(data) {
        let { scene, x, y, texture, frame } = data;
        super({ ...data, health: 20, drops: [], name: "player" });
        this.touching = [];

        // Collision bodies
        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    }

    static preload(scene) {
        scene.load.atlas('female', 'assets/images/female.png', 'assets/images/female_atlas.json');
        scene.load.animation("female_anim", "assets/images/female_anim.json");
        scene.load.spritesheet("items", "assets/images/items.png", { frameWidth: 32, frameHeight: 32 });
        // Audios
        scene.load.audio('player', 'assets/audio/player.mp3');
    }

    update() {

        // Movement
        const speed = 2.5;
        let playerVelocity = new Phaser.Math.Vector2();
        if (this.inputKeys.left.isDown) {
            playerVelocity.x = -1;
        } else if (this.inputKeys.right.isDown) {
            playerVelocity.x = 1;
        }
        if (this.inputKeys.up.isDown) {
            playerVelocity.y = -1;
        } else if (this.inputKeys.down.isDown) {
            playerVelocity.y = 1;
        }
        playerVelocity.normalize();
        playerVelocity.scale(speed);
        this.setVelocity(playerVelocity.x, playerVelocity.y);

        // Animation
        if (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
            this.anims.play("female_walk", true);
        } else {
            this.anims.play("female_idle", true);
        }

    }
}