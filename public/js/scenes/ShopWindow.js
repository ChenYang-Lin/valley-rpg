import { getCurrScene } from "../utils/utils.js";

export default class ShopWindow extends Phaser.Scene {
    constructor() {
        super("ShopWindow");
    }

    init() {
        this.currScene = getCurrScene();
    }

    create() {
        this.createShopStaticContents();
        this.refresh();
    }

    refresh() {
        
    }

    createShopStaticContents() {
        console.log("opened shop")
        // Shop Background
        this.background = this.add.rectangle(10, 10, 460, 250, 0xE9E9E9);
        this.background.setOrigin(0, 0);
        this.background.depth = -2;

        // Shop Header 
        this.headerBG = this.add.rectangle(10, 10, 460, 30, 0x000000);
        this.headerBG.setOrigin(0, 0);
        this.headerBG.depth = -1

        this.headerName = this.add.text(220, 20, "Shop", { fill: '#FFFFFF' })
        this.headerName.setOrigin(0.5, 0);

        this.closeBtn = this.add.sprite(445, 15, "closeBtn").setInteractive();
        this.closeBtn.setOrigin(0, 0);
        this.closeBtn.displayHeight = 20;
        this.closeBtn.displayWidth = 20;
        this.closeBtn.setTintFill(0xFFFFFF);
        this.closeBtn.on("pointerover", () => {
            this.closeBtn.setTintFill(0xA30606);
        });
        this.closeBtn.on("pointerout", () => {
            this.closeBtn.setTintFill(0xFFFFFF);
        });
        this.closeBtn.on("pointerdown", () => {
            this.scene.stop("ShopWindow");
            this.scene.get(this.currScene).isInventoryOpen = false;
        });
    }
}