import items from "../utils/Items.js";
import { getCurrScene } from "../utils/utils.js";

export default class InventoryWindow extends Phaser.Scene {
    constructor() {
        super("InventoryWindow");
        this.inventorySlot = [];
        this.selectedSlot = 0;
        this.hoverSlot = 0;
        this.strokeWidth = 2;
        this.itemInfoPanel = [];


        this.selectedSlotIndicator;
    }

    init() {
        this.currScene = getCurrScene();
        this.inventory = this.scene.get(this.currScene).player.inventory;
        // this.inventory.subscribe(() => this.refresh());

        this.maxRows = this.inventory.maxRows;
        this.maxColumns = this.inventory.maxColumns;
        this.maxPage = this.inventory.maxPage;
    }

    destroyInventorySlot(inventorySlot) {
        if (inventorySlot.item) inventorySlot.item.destroy();
        if (inventorySlot.quantityText) inventorySlot.quantityText.destroy();
        inventorySlot.destroy();
    }


    // updateSelected() {
    //     for (let i = 0; i < this.maxColumns; i++) {
    //         this.inventorySlot[i].tint = this.inventory.selected === i ? 0xffff00 : 0xffffff;
    //     }
    // }



    create() {
        // Player Input - Item Selection
        // this.input.on("wheel", (pointer, gameObject, deltaX, deltaY, deltaZ) => {
        //     if (this.scene.isActive("CraftingScene")) return;
        //     this.inventory.selected = Math.max(0, (this.inventory.selected + (deltaY > 0 ? 1 : -1)) % this.maxColumns);
        //     this.updateSelected();
        // })

        // this.scene.get(getCurrScene()).input.on(Phaser.Input.Events.POINTER_UP, (pointer) => {
        //     console.log(pointer.worldX);
        //     console.log(pointer.worldY);
        // })

        // Player Input - Drag item
        this.input.setTopOnly(false); // If set to false it will emit events from all Game Objects below a Pointer, not just the top one
        this.input.on("dragstart", () => {
            this.startIndex = this.hoverSlot;
            let slot = this.inventorySlot.filter(s => s.cell === this.startIndex);
            if (slot[0] && slot[0].quantityText)
                slot[0].quantityText.destroy();
        })
        this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
            this.draggingObject = gameObject;
            this.draggingObject.depth = 100;
            gameObject.x = this.input.mousePointer.x;
            gameObject.y = this.input.mousePointer.y;
        })
        this.input.on("dragend", () => {
            this.draggingObject.depth = 1;
            let moved = this.inventory.moveItem(this.startIndex, this.hoverSlot);
            if (moved)
                this.selectedSlot = this.hoverSlot;
            this.refresh();
        })


        // DRAW INVENTORY - Inventory Static contents
        this.createInventoryStaticContents();

        // Update and Render item slots
        this.refresh();
    }

    refresh() {
        // Empty Inventory Slots
        this.inventorySlot.forEach(inventorySlot => {
            if (inventorySlot.item) inventorySlot.item.destroy();
            if (inventorySlot.quantityText) inventorySlot.quantityText.destroy();
            inventorySlot.destroy();
        });
        this.inventorySlot = [];

        // Draw Player Stat Value
        this.attackValue = this.add.text(115, 220, `${0}`, { fill: '#000000' }).setFontSize(10).setOrigin(1, 0);
        this.armorValue = this.add.text(115, 230, `${0}`, { fill: '#000000' }).setFontSize(10).setOrigin(1, 0);
        this.healthValue = this.add.text(115, 240, `${0}`, { fill: '#000000' }).setFontSize(10).setOrigin(1, 0);
        this.abilityValue = this.add.text(225, 220, `${0}`, { fill: '#000000' }).setFontSize(10).setOrigin(1, 0);
        this.manaValue = this.add.text(225, 230, `${0}`, { fill: '#000000' }).setFontSize(10).setOrigin(1, 0);
        this.speedValue = this.add.text(225, 240, `${0}`, { fill: '#000000' }).setFontSize(10).setOrigin(1, 0);

        // Draw equipped item slots
        this.createItemCell(45, 59, 32, 32, 5, 903); // Helmet
        this.createItemCell(160, 59, 32, 32, 5, 904); // Cloth
        this.createItemCell(45, 114, 32, 32, 5, 902); // Shield
        this.createItemCell(160, 114, 32, 32, 5, 901); // Weapon
        this.createItemCell(45, 169, 32, 32, 5, 906); // Boot
        this.createItemCell(160, 169, 32, 32, 5, 905); // Pant

        // Draw Items Into Inventory Slots
        let startX = 246 - (this.strokeWidth / 2) - 11;
        let startY = 103 - (this.strokeWidth / 2) - 11;
        let margin = 7;
        for (let row = 0; row < this.maxRows; row++) {
            for (let column = 0; column < this.maxColumns; column++) {
                let x = startX + (column * 32) + (column * margin);
                let y = startY + (row * 42) + (row * margin);
                let width = 32;
                let height = 42;
                let radius = 5;
                let cell = (row * this.maxColumns) + column;

                this.createItemCell(x, y, width, height, radius, cell);
            }
        }

        this.prevPageBtn = this.add.text(234, 240, '< Prev Page', { fill: '#0000ff' }).setFontSize(10).setOrigin(0, 0).setInteractive();
        this.nextPageBtn = this.add.text(460, 240, 'Next Page >', { fill: '#0000ff' }).setFontSize(10).setOrigin(1, 0).setInteractive();
        this.page = this.add.text(347, 240, `Page ${0}`, { fill: '#000000' }).setFontSize(10).setOrigin(0.5, 0)

        // Indicate selected slot
        this.indicateSelectedSlot();

    }

    createItemCell(x, y, width, height, radius, cell) {
        let inventorySlot = this.add.graphics();
        inventorySlot.cell = cell;

        inventorySlot.indicator = {};
        inventorySlot.indicator.x = x;
        inventorySlot.indicator.y = y;
        inventorySlot.indicator.width = width;
        inventorySlot.indicator.height = height;
        inventorySlot.indicator.radius = radius;

        inventorySlot.setInteractive(new Phaser.Geom.Rectangle(x, y, width, height), Phaser.Geom.Rectangle.Contains);
        inventorySlot.lineStyle(this.strokeWidth, 0x000000, 1); // (width, color, alpha)
        inventorySlot.strokeRoundedRect(x, y, width, height, radius); // (x, y, width, height, radius)
        inventorySlot.depth = -1

        inventorySlot.on("pointerover", () => {
            this.hoverSlot = cell;
            inventorySlot.lineStyle(this.strokeWidth, 0xEBC400, 1); // (width, color, alpha)
            inventorySlot.strokeRoundedRect(x, y, width, height, radius); // (x, y, width, height, radius)
            // console.log("pointer over: " + this.hoverSlot);
        })
        inventorySlot.on("pointerout", () => {
            inventorySlot.lineStyle(this.strokeWidth, 0x000000, 1); // (width, color, alpha)
            inventorySlot.strokeRoundedRect(x, y, width, height, radius); // (x, y, width, height, radius)
        })
        inventorySlot.on("pointerdown", () => {
            this.selectedSlot = this.hoverSlot;
            this.indicateSelectedSlot();
        })

        // Draw items in the slot (if currect slot has item)
        let item = this.inventory.getItem(cell);
        if (item) {
            inventorySlot.item = this.add.sprite(x + 16, y + 16, "items", items[item.name].frame).setOrigin(0.5, 0.5);
            inventorySlot.item.setScale();
            inventorySlot.quantityText = this.add.text(x + 16, y + 42, `x${item.quantity}`, {
                font: "11px Courier",
                fill: "#000",
            }).setOrigin(.5, 1);
            // Dragging
            inventorySlot.item.setInteractive();
            this.input.setDraggable(inventorySlot.item);
            this.input.dragDistanceThreshold = 8;
        }

        this.inventorySlot.push(inventorySlot);
    }

    indicateSelectedSlot() {
        // Draw Selected
        let selectedInventorySlot = this.inventorySlot.filter(s => s.cell === this.selectedSlot);
        if (!selectedInventorySlot[0]) return;
        let data = selectedInventorySlot[0].indicator;

        if (this.selectedSlotIndicator) this.selectedSlotIndicator.destroy();
        this.selectedSlotIndicator = this.add.graphics();
        this.selectedSlotIndicator.lineStyle(this.strokeWidth, 0xff0000, 1); // (width, color, alpha)
        this.selectedSlotIndicator.strokeRoundedRect(data.x, data.y, data.width, data.height, data.radius); // (x, y, width, height, radius)

        // Item info
        let item = this.inventory.getItem(selectedInventorySlot[0].cell);
        let itemName = "No Item Selected";
        let itemType = "";
        if (item) {
            itemName = items[item.name].name;
            itemType = items[item.name].type;
        }

        this.itemInfoPanel.forEach(item => {
            item.destroy();
        })

        this.infoItemNameText = this.add.text(350, 50, `${itemName}`, { fill: '#000000' }).setFontSize(24).setOrigin(0.5, 0);
        this.itemInfoPanel.push(this.infoItemNameText);
        this.infoItemTypeText = this.add.text(350, 74, `${itemType}`, { fill: '#3F3F3F' }).setFontSize(12).setOrigin(0.5, 0);
        this.itemInfoPanel.push(this.infoItemTypeText);

    }

    createInventoryStaticContents() {
        // Inventory Background
        this.background = this.add.rectangle(10, 10, 460, 250, 0xE9E9E9);
        this.background.setOrigin(0, 0);
        this.background.depth = -2;

        // Inventory Header 
        this.headerBG = this.add.rectangle(10, 10, 460, 30, 0x000000);
        this.headerBG.setOrigin(0, 0);
        this.headerBG.depth = -1

        this.headerName = this.add.text(220, 20, "Inventory", { fill: '#FFFFFF' })
        this.headerName.setOrigin(0.5, 0);

        this.closeBtn = this.add.sprite(445, 15, "inventoryCloseBtn").setInteractive();
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
            this.scene.stop("InventoryWindow");
            this.scene.get(this.currScene).isInventoryOpen = false;
        });

        // player equipped items
        this.playerImage = this.add.sprite(90, 100, "player", 0).setOrigin(0, 0);

        this.helmetStroke1 = this.add.line(0, 0, 123, 115, 123, 75, 0x000000).setOrigin(0, 0);
        this.helmetStroke2 = this.add.line(0, 0, 77, 75, 124, 75, 0x000000).setOrigin(0, 0);
        this.helmetText = this.add.text(61, 50, "Helmet", { fill: '#000000' }).setFontSize(10).setOrigin(0.5, 0.5);

        this.clothStroke1 = this.add.line(0, 0, 123, 140, 140, 120, 0x000000).setOrigin(0, 0);
        this.clothStroke2 = this.add.line(0, 0, 140, 120, 140, 75, 0x000000).setOrigin(0, 0);
        this.clothStroke3 = this.add.line(0, 0, 139, 75, 160, 75, 0x000000).setOrigin(0, 0);
        this.helmetText = this.add.text(176, 50, "Cloth", { fill: '#000000' }).setFontSize(10).setOrigin(0.5, 0.5);

        this.shieldStroke = this.add.line(0, 0, 110, 148, 77, 130, 0x000000).setOrigin(0, 0);
        this.shieldText = this.add.text(61, 105, "Shield", { fill: '#000000' }).setFontSize(10).setOrigin(0.5, 0.5);

        this.weaponStroke = this.add.line(0, 0, 135, 148, 160, 130, 0x000000).setOrigin(0, 0);
        this.weaponText = this.add.text(176, 105, "Weapon", { fill: '#000000' }).setFontSize(10).setOrigin(0.5, 0.5);

        this.bootStroke1 = this.add.line(0, 0, 112, 160, 95, 185, 0x000000).setOrigin(0, 0);
        this.bootStroke2 = this.add.line(0, 0, 95, 185, 77, 185, 0x000000).setOrigin(0, 0);
        this.bootText = this.add.text(60, 160, "Boot", { fill: '#000000' }).setFontSize(10).setOrigin(0.5, 0.5);

        this.pantStroke1 = this.add.line(0, 0, 127, 155, 150, 185, 0x000000).setOrigin(0, 0);
        this.pantStroke2 = this.add.line(0, 0, 150, 185, 160, 185, 0x000000).setOrigin(0, 0);
        this.pantText = this.add.text(176, 160, "Pant", { fill: '#000000' }).setFontSize(10).setOrigin(0.5, 0.5);

        // Stats
        this.attackText = this.add.text(20, 220, `Attack Damage: `, { fill: '#000000' }).setFontSize(10).setOrigin(0, 0);
        this.armorText = this.add.text(20, 230, `Armor: `, { fill: '#000000' }).setFontSize(10).setOrigin(0, 0);
        this.healthText = this.add.text(20, 240, `Health: `, { fill: '#000000' }).setFontSize(10).setOrigin(0, 0);
        this.abilityText = this.add.text(130, 220, `Ability Power: `, { fill: '#000000' }).setFontSize(10).setOrigin(0, 0);
        this.manaText = this.add.text(130, 230, `Mana: `, { fill: '#000000' }).setFontSize(10).setOrigin(0, 0);
        this.speedText = this.add.text(130, 240, `Speed: `, { fill: '#000000' }).setFontSize(10).setOrigin(0, 0);
    }


    get tileSize() {
        return this._tileSize * this.uiScale;
    }
}