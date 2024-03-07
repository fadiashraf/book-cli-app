"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repository = void 0;
class Repository {
    constructor(database) {
        this.database = database;
        this.data = this.database.loadData();
        this.nextId = this.calculateNextId();
    }
    calculateNextId() {
        const maxId = this.data.reduce((max, item) => {
            const itemId = item.id;
            return itemId !== undefined && itemId > max ? itemId : max;
        }, 0);
        return maxId + 1;
    }
    getAll() {
        return this.data;
    }
    createOne(newObject) {
        newObject.id = this.nextId;
        this.data.push(newObject);
        this.nextId++;
        this.database.saveData(this.data);
        return newObject;
    }
    updateOneById(id, updatedItem) {
        const index = this.data.findIndex((item) => item.id == id);
        if (index !== -1) {
            updatedItem.id = id;
            // ignore empty or undefined values
            for (const key in updatedItem) {
                if (Object.prototype.hasOwnProperty.call(updatedItem, key)) {
                    this.data[index][key] = updatedItem[key] || this.data[index][key];
                }
            }
            this.database.saveData(this.data);
        }
        return updatedItem;
    }
}
exports.Repository = Repository;
