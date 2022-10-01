import * as fs from 'fs';
import * as path from "path";

class ConfigRepository {
    private configPath = path.resolve(__dirname, "config.json");
    private rootPath = path.resolve(__dirname, "");
    config: Record<string, any>;
    defaultConfig: Record<string, any> = {
        background: path.resolve(__dirname, "./static/background.jpg")
    }

    constructor() {
        if (!fs.readdirSync(this.rootPath).includes("config.json")) {
            fs.writeFileSync(this.configPath, JSON.stringify(this.defaultConfig))
            this.config = this.defaultConfig;
        } else {
            this.config = JSON.parse(fs.readFileSync(this.configPath, {encoding: "utf-8"}))
        }
    }

    private updateConfig(newConfig: Record<string, any>) {
        this.config = newConfig;
        fs.writeFileSync(this.configPath, JSON.stringify(this.config))
    }

    updateBackground(newBackground) {
        this.config.background = newBackground;

    }
}

export default new ConfigRepository()