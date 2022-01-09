import MatterEntity from "./MatterEntity.js";

export default class Resource extends MatterEntity {
    constructor(data) {
        let { scene, resource } = data;
        let drops = JSON.parse(resource.properties.find(p => p.name == "drops").value);
        let depth = resource.properties.find(p => p.name == "depth").value;
        super({ name: resource.type, scene, x: resource.x, y: resource.y, health: 5, texture: "resources", frame: resource.type, drops, depth });
        this.category = "Resource";

        let yOrigin = resource.properties.find(p => p.name == "yOrigin").value;
        this.y = this.y + this.height * (yOrigin - 0.5);
        const { Bodies } = Phaser.Physics.Matter.Matter;
        let circleCollider = Bodies.circle(this.x, this.y, 12, { isSensor: false, label: "collider" })
        this.setExistingBody(circleCollider);
        this.setStatic(true);
        this.setOrigin(0.5, yOrigin);
    }

    static preload(scene) {
        scene.load.atlas("resources", "assets/img/resources.png", "assets/img/resources_atlas.json");
        // Audios
        scene.load.audio('tree', 'assets/audio/tree.mp3');
        scene.load.audio('rock', 'assets/audio/rock.mp3');
        scene.load.audio('bush', 'assets/audio/bush.mp3');
        scene.load.audio('pickup', 'assets/audio/pickup.mp3');
    }
}