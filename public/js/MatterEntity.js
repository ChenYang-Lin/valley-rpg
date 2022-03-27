import DropItem from "./DropItem.js";
import items from "./utils/Items.js";

export default class MatterEntity extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let { name, scene,  x, y, health, drops, texture, frame } = data;
        super(scene.matter.world, x, y, texture, frame);
        // this.x += this.width / 2;
        // this.y -= this.height / 2;
        this.y -= 32; // there is bug with tiled map that y is starting at 32
        // this.depth = depth || 1;
        this.depth = y;
        this.name = name;
        this.health = health;
        this.drops = drops || "[\"berries\",\"berries\"]";
        this._position = new Phaser.Math.Vector2(this.x, this.y);
        // if (this.name) this.sound = this.scene.sound.add(this.name);
        
        // this.setOrigin(1, 1)
        
        this.scene.add.existing(this);
    }

    get position() {
        this._position.set(this.x, this.y);
        return this._position;
    }

    get velocity() {
        return this.body.velocity;
    }

    get dead() {
        return this.health <= 0;
    }

    onDeath = () => {

    }

    destroySelf = () => {
        this.destroy();
    }

    hit = () => {
        if (this.sound) this.sound.play();
        this.health--;
        if (this.dead) {
            this.onDeath();
            this.drops.forEach(drop => {
                new DropItem({ name: drop, scene: this.scene, x: this.x, y: this.y, frame: items[drop].frame })
            });
        }
    }
}