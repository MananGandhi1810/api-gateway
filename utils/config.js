import fs from "fs";
import YAML from "yaml";
import { parseArgs } from "util";
import path from "path";
import { configSchema } from "./schema.js";

export const getConfigPath = (filePath = null) => {
    if (!filePath) {
        const args = process.argv;
        const options = {
            conf: {
                type: "string",
                short: "c",
            },
        };
        const { values: argValues } = parseArgs({
            args,
            options,
            allowPositionals: true,
        });
        filePath = argValues.conf;
    }

    var configFilePath;

    if (filePath.startsWith(".")) {
        configFilePath = path.join(
            process.cwd(),
            filePath.slice(2, argValues.conf.length),
        );
    } else if (filePath.startsWith("/")) {
        configFilePath = filePath;
    } else {
        configFilePath = path.join(process.cwd(), filePath);
    }

    return configFilePath;
};

export const readConfig = (filePath) => {
    if (filePath === undefined || filePath === null) {
        throw new Error("Please provide a config file");
    }

    if (!fs.existsSync(filePath)) {
        throw new Error("File not found");
    }

    const rawConf = fs.readFileSync(filePath).toString();
    var config;

    try {
        config = configSchema.parse(YAML.parse(rawConf));
    } catch (e) {
        console.log(e);
        throw new Error("Could not parse config file");
    }

    return config;
};
