import { tileSize } from "./utils/utils.js";
import MatterEntity from "./MatterEntity.js";
import TransparentSensor from "./TransparentSensor.js";

export default class Resource extends MatterEntity {
    constructor(data) {
        let { scene, resource } = data;
        let drops = JSON.parse(resource.properties.find(p => p.name == "drops").value);
        let moveLeft = resource.properties.find(p => p.name == "moveLeft")?.value;
        // let depth = resource.properties.find(p => p.name == "depth").value;

        super({ name: resource.type, scene, x: resource.x, y: resource.y, health: 5, texture: "resources", frame: resource.type, drops });
        this.category = "Resource";

        let offsetTop = resource.properties.find(p => p.name == "offsetTop").value;
        let offsetBot = resource.properties.find(p => p.name == "offsetBot").value;
        let offsetLeft = resource.properties.find(p => p.name == "offsetLeft").value;
        let offsetRight = resource.properties.find(p => p.name == "offsetRight").value;
        this.behindY = resource.properties.find(p => p.name == "behindY")?.value;
        this.behindYSize = resource.properties.find(p => p.name == "behindYSize")?.value;

        // originY = 0.5; offsetTop / offsetBot -> difference; height => proprtion
        // y position top edge
        this.y += this.height / 2;
        this.yOrigin = this.originY + ((offsetTop - offsetBot) / 2) / (this.height / tileSize);
        this.y += this.height * (this.yOrigin - 0.5);
        if (this.behindY)
            this.y -= this.behindY * tileSize;

        // x position left edge
        this.x += this.width / 2
        this.xOrigin = this.originX + ((offsetLeft - offsetRight) / 2) / (this.width / tileSize);
        this.x += this.width * (this.xOrigin - 0.5)
        if (moveLeft) {
            this.x -= tileSize / 2
        }

        this.depthPoint = resource.properties.find(p => p.name == "depthPoint").value;
        this.depth = this.y + this.height * (this.depthPoint - 0.5);
        
        // draw collision body and sensor for this resource
        const { Bodies } = Phaser.Physics.Matter.Matter;
        const colliderWidth = this.width - offsetLeft*tileSize - offsetRight*tileSize;
        const colliderHeight = this.height - offsetTop*tileSize - offsetBot*tileSize;
        let objectCollider = Bodies.rectangle(this.x, this.y, colliderWidth, colliderHeight, { isSensor: false, label: "collider" })
        
        if (this.behindY)
            this.transparentSensor = new TransparentSensor({ scene: scene, parent: this, x: this.x, y: this.y - (colliderHeight/2) - ((this.behindYSize*tileSize)/2), width: colliderWidth, height: this.behindYSize*tileSize })
        
        this.setExistingBody(objectCollider);
        this.setStatic(true);
        this.setOrigin(this.xOrigin, this.yOrigin);

        // console.log(resource.type, this.x, this.y)
        // console.log(this.position)
    }

    static preload(scene) {
        scene.load.atlas("resources", "assets/img/objects/resources.png", "assets/img/objects/resources_atlas.json");
        // Audios
        scene.load.audio('tree', 'assets/audio/tree.mp3');
        scene.load.audio('rock', 'assets/audio/rock.mp3');
        scene.load.audio('bush', 'assets/audio/bush.mp3');
        scene.load.audio('pickup', 'assets/audio/pickup.mp3');
    }
    
    get position() {
        // console.log(this.xOrigin)
        let x = this.x - this.width * (this.xOrigin - 0.5) - (this.width / 2); // x position at left edge
        let y = this.y - this.height * (this.yOrigin - 0.5) - (this.height / 2) + (this.behindY * tileSize)
        this._position.set(Math.round(x), Math.round(y));
        return this._position;
    }

    destroySelf = () => {
        this.destroy();
        this.transparentSensor?.destroySelf();
    }
}