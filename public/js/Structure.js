import { tileSize } from "./utils/utils.js";
import TransparentSensor from "./TransparentSensor.js";

export default class Structure extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let { scene, structure } = data;   
        let moveLeft = structure.properties.find(p => p.name == "moveLeft")?.value;

        super(scene.matter.world, structure.x, structure.y, "structures", structure.type);

        this.y -= 32; // there is bug with tiled map that y is starting at 32
        this.depth = this.y;
        this.name = this.type;
        this._position = new Phaser.Math.Vector2(this.x, this.y);
        this.scene.add.existing(this);

        this.category = "Structure";
        let offsetTop = structure.properties.find(p => p.name == "offsetTop").value;
        let offsetBot = structure.properties.find(p => p.name == "offsetBot").value;
        let offsetLeft = structure.properties.find(p => p.name == "offsetLeft").value;
        let offsetRight = structure.properties.find(p => p.name == "offsetRight").value;
        this.behindY = structure.properties.find(p => p.name == "behindY").value;
        this.behindYSize = structure.properties.find(p => p.name == "behindYSize")?.value;
        
        // originY = 0.5; offsetTop / offsetBot -> difference; height => proprtion
        // y position top edge
        this.y += this.height / 2;
        this.yOrigin = this.originY + ((offsetTop - offsetBot) / 2) / (this.height / tileSize);
        this.y = this.y + this.height * (this.yOrigin - 0.5);
        if (this.behindY)
            this.y -= this.behindY * tileSize;

        // x position left edge
        this.x += this.width / 2
        this.xOrigin = this.originX + ((offsetLeft - offsetRight) / 2) / (this.width / tileSize);
        this.x += this.width * (this.xOrigin - 0.5)
        if (moveLeft) {
            this.x -= tileSize / 2
        }

        this.depthPoint = structure.properties.find(p => p.name == "depthPoint").value;
        this.depth = this.y + this.height * (this.depthPoint - 0.5);

        // draw collision body and sensor for this structure
        const { Bodies } = Phaser.Physics.Matter.Matter;
        const colliderWidth = this.width - offsetLeft*tileSize - offsetRight*tileSize;
        const colliderHeight = this.height - offsetTop*tileSize - offsetBot*tileSize;
        const objectCollider = Bodies.rectangle(this.x, this.y, colliderWidth, colliderHeight, { isSensor: false, label: "objectCollider"});
        
        if (this.behindY)
            this.transparentSensor = new TransparentSensor({ scene: scene, parent: this, x: this.x, y: this.y - (colliderHeight/2) - ((this.behindYSize*tileSize)/2), width: colliderWidth, height: this.behindYSize*tileSize })

        this.setExistingBody(objectCollider);
        this.setStatic(true);
        this.setOrigin(this.xOrigin, this.yOrigin);

        console.log(structure.type, this.x, this.y)
        console.log(this.position)
        // console.log(this.Matter.Bodies)
    }

    static preload(scene) {
        scene.load.atlas("structures", "assets/img/structures.png", "assets/img/structures_atlas.json");
        // Audios
        // scene.load.audio('tree', 'assets/audio/tree.mp3');
        // scene.load.audio('rock', 'assets/audio/rock.mp3');
        // scene.load.audio('bush', 'assets/audio/bush.mp3');
        // scene.load.audio('pickup', 'assets/audio/pickup.mp3');
    }

    get position() {
        let x = this.x - this.width * (this.xOrigin - 0.5) - (this.width / 2); // x position at left edge
        let y = this.y - this.height * (this.yOrigin - 0.5) - (this.height / 2) 
        if (this.behindY)
            y += (this.behindY * tileSize);
        this._position.set(x, y);
        return this._position;
    }
}