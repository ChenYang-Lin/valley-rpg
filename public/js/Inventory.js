import items from "./utils/Items.js";

export default class Inventory {
    constructor() {
        this.maxColumns = 6;
        this.maxRows = 3;
        this.maxPage = 1;
        this.selected = 0;
        this.observers = [];

        this.items = {
            2: { name: "stone", quantity: 2 },
            6: { name: "fur", quantity: 3 },
            8: { name: "meat", quantity: 1 },
            14: { name: "health_potion", quantity: 5 },
            15: { name: "wand_fire", quantity: 1 },
        }
        this.addItem({ name: "wood", quantity: 1 });
    }

    subscribe(fn) {
        this.observers.push(fn);
    }
    unsubscribe(fn) {
        this.observers = this.observers.filter(subscriber => subscriber !== fn);
    }
    broadcast() {
        this.observers.forEach(subscriber => subscriber());
    }

    addItem(item) {
        let existingKey = Object.keys(this.items).find(key => this.items[key].name === item.name);
        if (existingKey) {
            this.items[existingKey].quantity += item.quantity;
        } else {
            for (let i = 0; i < this.maxColumns * this.maxRows * this.maxPage; i++) {
                let existingItem = this.items[i];
                if (!existingItem) {
                    this.items[i] = item;
                    break;
                }
            }
        }
        this.broadcast();
    }

    removeItem(itemName) {
        let existingKey = Object.keys(this.items).find(key => this.items[key].name === itemName);
        if (existingKey) {
            this.items[existingKey].quantity--;
            if (this.items[existingKey].quantity <= 0) delete this.items[existingKey];
        }
        this.broadcast();
    }

    getItem(index) {
        return this.items[index];
    }

    moveItem(start, end) {
        console.log(`start: ${start} end: ${end}`)
        if (start === end || this.items[end]) return false;
        let isEquipment = this.isEquipment(end);
        console.log(isEquipment);
        if (!isEquipment) {
            this.items[end] = this.items[start];
            delete this.items[start];
            this.broadcast();
            return true;
        }
        else {
            // if (this.equip(end))
            //     return true;
        }
        return false;
    }

    isEquipment(end) {
        if (end >= 901 && end <= 906)
            return true;
        else
            return false;
    }

    // equip(end) {
    //     if (end === 901) {

    //     }
    // }

    get selectedItem() {
        return this.items[this.selected];
    }

    getItemFrame(item) {
        return items[item.name].frame;
    }

    getItemQuantity(itemName) {
        return Object.values(this.items).filter(i => i.name === itemName).map(i => i.quantity).reduce((accumulater, currentValue) => accumulater + currentValue, 0);
    }
}