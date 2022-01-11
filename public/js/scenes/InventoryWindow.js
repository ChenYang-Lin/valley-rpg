import items from "../utils/Items.js";

export default class InventoryWindow extends Phaser.Scene {
    constructor() {
        super("InventoryWindow");
        this.margin = 8;
        this.uiScale = 1;
        this._tileSize = 32;
        this.rows = 1;
        this.gridSpacing = 4;
        this.inventorySlot = [];
        this.isOpen = false;
    }

    init(data) {
        let { mainScene } = data;
        this.mainScene = mainScene;
        this.inventory = mainScene.player.inventory;
        this.maxColumns = this.inventory.maxColumns;
        this.maxRows = this.inventory.maxRows;
        // this.inventory.subscribe(() => this.refresh());
    }

    destroyInventorySlot(inventorySlot) {
        if (inventorySlot.item) inventorySlot.item.destroy();
        if (inventorySlot.quantityText) inventorySlot.quantityText.destroy();
        inventorySlot.destroy();
    }

    refresh() {
        return;

        console.log("refresh inventoy scene")
        // Empty Slots
        this.inventorySlot.forEach(s => this.destroyInventorySlot(s));
        this.inventorySlot = [];

        for (let i = 0; i < this.maxColumns * this.rows; i++) {
            // Draw slot ui
            let x = this.margin + this.tileSize / 2 + ((i % this.maxColumns) * (this.tileSize + this.gridSpacing));
            let y = this.margin + this.tileSize / 2 + (Math.floor(i / this.maxColumns) * (this.tileSize + this.gridSpacing));
            let inventorySlot = this.add.sprite(x, y, "items", 11);
            inventorySlot.setScale(this.uiScale);
            inventorySlot.setDepth(-1);

            // Interative - Drag and Drop
            inventorySlot.setInteractive();
            inventorySlot.on("pointerover", pointer => {
                console.log(`pointerover:${i}`);
                this.hoverIndex = i;
            });

            // Draw items in the slot (if currect slot has item)
            let item = this.inventory.getItem(i);
            if (item) {
                inventorySlot.item = this.add.sprite(inventorySlot.x, inventorySlot.y - this.tileSize / 12, "items", items[item.name].frame);
                inventorySlot.item.setScale(this.uiScale * 0.6);
                inventorySlot.quantityText = this.add.text(inventorySlot.x, inventorySlot.y + this.tileSize / 12, item.quantity, {
                    font: "11px Courier",
                    fill: "#111",
                }).setOrigin(0.5, 0);
                // Dragging
                inventorySlot.item.setInteractive();
                this.input.setDraggable(inventorySlot.item);
            }
            this.inventorySlot.push(inventorySlot);
        }
        this.updateSelected();
    }

    updateSelected() {
        for (let i = 0; i < this.maxColumns; i++) {
            this.inventorySlot[i].tint = this.inventory.selected === i ? 0xffff00 : 0xffffff;
        }
    }

    showInventory() {
        this.isOpen = true;

        let inventoryWindow = this.add.rectangle(10, 10, this.game.renderer.width - 20, this.game.renderer.height - 20, 0xffffff, 1);
        inventoryWindow.setOrigin(0, 0);
    }

    hideInventory() {
        this.isOpen = false;
    }

    create() {
        // Player Input - Item Selection
        // this.input.on("wheel", (pointer, gameObject, deltaX, deltaY, deltaZ) => {
        //     if (this.scene.isActive("CraftingScene")) return;
        //     this.inventory.selected = Math.max(0, (this.inventory.selected + (deltaY > 0 ? 1 : -1)) % this.maxColumns);
        //     this.updateSelected();
        // })

        // // Player Input - Expand Inventory
        // this.input.keyboard.on("keydown-B", () => {
        //     // this.rows = this.rows === 1 ? this.maxRows : 1;
        //     // this.refresh();
        //     this.isOpen ? this.hideInventory() : this.showInventory();
        // })

        // Player Input - Drag Item
        this.input.setTopOnly(false);
        this.input.on("dragstart", () => {
            console.log("dragstart");
            this.startIndex = this.hoverIndex;
            this.inventorySlot[this.startIndex].quantityText.destroy();
        })
        this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        })
        this.input.on("dragend", () => {
            this.inventory.moveItem(this.startIndex, this.hoverIndex);
            this.refresh();
        })

        this.showInventory();
    }

    get tileSize() {
        return this._tileSize * this.uiScale;
    }
}