import * as fs from 'fs';
import * as path from "path";

interface User {
    puuid: string;
    username: string;
    password: string;
}

class DbRepository {
    private dbPath = path.resolve(__dirname, "db.json");
    private rootPath = path.resolve(__dirname, "");
    db: User[]

    constructor() {
        if (!fs.readdirSync(this.rootPath).includes("db.json")) {
            fs.writeFileSync(this.dbPath, JSON.stringify([]))
            this.db = [];
        } else {
            this.db = JSON.parse(fs.readFileSync(this.dbPath, {encoding: "utf-8"}))
        }
    }

    private updateDb(newDb: User[]) {
        this.db = newDb;
        fs.writeFileSync(this.dbPath, JSON.stringify(this.db))
    }

    addUser(puuid: string, username: string, password: string) {
        if (!this.db.find(u => u.puuid === puuid)) {
            const newDb = [...this.db, {puuid, username, password}];
            this.updateDb(newDb)
        }
    }
}

export default new DbRepository()