export default class transparentSensor extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let { scene, parent, x, y, width, height } = data;
        super(scene.matter.world, x, y, null, null);

        // console.log(this.x, this.y)
        this.parent = parent;
        this.alpha = 0;

        const { Bodies } = Phaser.Physics.Matter.Matter;
        const objectSensor = Bodies.rectangle(this.x, this.y, width - 1, height, { isSensor: true, label: "objectSensor"});
        this.setExistingBody(objectSensor);
        this.setStatic(true);

        this.enterBehindObject(objectSensor)


        this.scene.add.existing(this);
    }

    enterBehindObject(objectSensor) {
        this.scene.matterCollision.addOnCollideStart({
            objectA: [objectSensor],
            callback: other => {
                if (other.bodyB && other.bodyB.label == "playerCollider" && other.gameObjectB && other.gameObjectB.isMainPlayer) {
                    this.parent.alpha = 0.5
                }
            }
        })
        this.scene.matterCollision.addOnCollideEnd({
            objectA: [objectSensor],
            callback: other => {
                if (other.bodyB && other.bodyB.label == "playerCollider" && other.gameObjectB && other.gameObjectB.isMainPlayer) {
                    this.parent.alpha = 1
                }
            }
        })
    }

    destroySelf = () => {
        this.destroy();
    }
}