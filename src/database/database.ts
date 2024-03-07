import fs from 'fs';
import path from "path";
import { config } from '../../config'

export interface IDatabase<model> {
    loadData (): Array<model>
    saveData (newData: Array<model>): void
}


export class FileDatabase<model> implements IDatabase<model> {
    private fileExtension: string;
    private filePath: string;
    constructor(public model: any) {
        this.fileExtension = config?.fileExtension ?? 'json'
        this.filePath = path.resolve(__dirname, `../../../databaseFiles/${this.model?.name}.${this.fileExtension}`)
    }

    loadData (): Array<model> {
        try {

            const data = JSON.parse(fs.readFileSync(this.filePath, { encoding: 'utf8' }));
            return data ?? []
        } catch (error) {
            console.log("something wrong happened when load data")
            return []
        }

    }

    saveData (newData: Array<model>): void {
        try {
            const jsonString = JSON.stringify(newData);
            fs.writeFileSync(this.filePath, jsonString, { encoding: 'utf8' })
        } catch (error) {
            console.log("something wrong happened when save data")
        }
    }
}