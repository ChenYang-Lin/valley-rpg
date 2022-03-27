import MatterEntity from "./MatterEntity.js";

export default class Enemy extends MatterEntity {
    constructor(data) {
        let { scene, enemy } = data;
        let drops = JSON.parse(enemy.properties.find(p => p.name == 'drops').value);
        let health = enemy.properties.find(p => p.name == 'health').value;
        super({ scene, x: enemy.x, y: enemy.y, texture: "enemies", frame: `${enemy.name}_idle_1`, drops, health, name: enemy.name });

        // Collision bodies
        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        let enemyCollider = Bodies.circle(this.x, this.y, 12, { isSensor: false, label: "enemyCollider" });
        let enemySensor = Bodies.circle(this.x, this.y, 80, { isSensor: true, label: "enemySensor" });
        const compoundBody = Body.create({
            parts: [enemyCollider, enemySensor],
            frictionAir: 0.35,
        });
        this.setExistingBody(compoundBody);
        this.setFixedRotation();

        this.scene.matterCollision.addOnCollideStart({
            objectA: [enemySensor],
            callback: other => {
                // console.log(other.bodyB)
                if (other.bodyB && other.bodyB.label == "playerCollider" && other.gameObjectB && other.gameObjectB.isMainPlayer) {
                    console.log("player entered")
                    this.attacking = other.gameObjectB;
                }
            },
            context: this.scene,
        })
        this.scene.matterCollision.addOnCollideEnd({
            objectA: [enemySensor],
            callback: other => {
                if (other.bodyB && other.bodyB.label == "playerCollider" && other.gameObjectB && other.gameObjectB.isMainPlayer) {
                    console.log("player exited")
                    this.attacking = null
                }
            },
            context: this.scene,
        })
    }

    
    
    static preload(scene) {
        scene.load.atlas("enemies", "assets/img/enemy/enemies.png", "assets/img/enemy/enemies_atlas.json");
        scene.load.animation("enemies_anim", "assets/img/enemy/enemies_anim.json");
        // Audios
        // scene.load.audio('bear', 'assets/audio/bear.mp3');
        // scene.load.audio('wolf', 'assets/audio/wolf.mp3');
        // scene.load.audio('ent', 'assets/audio/ent.mp3');
    }

    attack = (target) => {
        if (target.dead || this.dead) {
            clearInterval(this.attackTimer);
            return;
        }
        target.hit();
    }

    update() {
        // console.log("enemy")
        if (this.dead) return;
        if (this.attacking) {
            let player = this.attacking.position;
            let direction = player.subtract(this.position);
            if (direction.length() > 24) {
                let v = direction.normalize();
                this.setVelocityX(direction.x);
                this.setVelocityY(direction.y);
                if (this.attackTimer) {
                    clearInterval(this.attackTimer);
                    this.attackTimer = null;
                }
            } else {
                if (this.attackTimer == null) {
                    this.attackTimer = setInterval(this.attack, 500, this.attacking);
                }
            }
        }
        // Flip image based on direction
        this.setFlipX(this.velocity.x < 0);

        // Animation
        if (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
            this.anims.play(`${this.name}_walk`, true);
        } else {
            this.anims.play(`${this.name}_idle`, true);
        }
    }
}
