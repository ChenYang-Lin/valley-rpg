export class ShopWindow extends Phaser.Scene {
    create() {
        let clickCount = 0;
        this.clickCountText = this.add.text(100, 200, "");
    }
}