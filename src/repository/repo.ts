import { IDatabase } from '../database/database';


export interface IRepository<T> {
    getAll (): Array<T>;
    createOne (newObject: T): T;
    updateOneById (id: number, newObject: T): T;
}



export class Repository<T extends { id?: number }> implements IRepository<T> {
    private data: Array<T>;
    private nextId: number;

    constructor(private database: IDatabase<T>) {
        this.data = this.database.loadData();
        this.nextId = this.calculateNextId();
    }

    private calculateNextId (): number {
        const maxId = this.data.reduce((max, item) => {
            const itemId = item.id;
            return itemId !== undefined && itemId > max ? itemId : max;
        }, 0);
        return maxId + 1;
    }

    getAll (): Array<T> {
        return this.data;
    }

    createOne (newObject: T): T {
        newObject.id = this.nextId;
        this.data.push(newObject);
        this.nextId++;
        this.database.saveData(this.data);
        return newObject
    }

    updateOneById (id: number, updatedItem: T): T {
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
        return updatedItem
    }
}
