
export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: "MenuScene",
        });
    }

    init(data) {
        console.log(data);
        console.log("I got it");
    }

    preload() { }

    create() {

        // Background Image
        let bg = this.add.image(0, 0, "title_bg").setOrigin(0, 0).setDepth(0);
        bg.displayWidth = this.game.renderer.width;
        bg.displayHeight = this.game.renderer.height;

        // Play Button
        let playButton = this.add
            .image(this.game.renderer.width / 2, this.game.renderer.height / 2, "play_button")
            .setDepth(1);

        // Hover Sprite
        let hoverSprite = this.add.sprite(100, 100, "cat");
        hoverSprite.setScale(2);
        hoverSprite.setVisible(false);

        // Create Animation
        this.anims.create({
            key: "walk",
            frameRate: 4,
            repeat: -1, // repeat forever
            frames: this.anims.generateFrameNumbers("cat", {
                frames: [0, 1, 2, 3],
            }),
        });

        // PointerEvents
        playButton.setInteractive();

        playButton.on("pointerover", () => {
            console.log("pointerover");
            hoverSprite.setVisible(true);
            hoverSprite.play("walk");
            hoverSprite.x = playButton.x - playButton.width;
            hoverSprite.y = playButton.y;
        });
        playButton.on("pointerout", () => {
            console.log("poinhterout");
            hoverSprite.setVisible(false);
        });
        playButton.on("pointerup", () => {
            console.log("pointerup");
            this.scene.start("ValleyScene");
        });
        playButton.on("pointerdown", () => {
            console.log("pointerdown");
        });
    }
}
