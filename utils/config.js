import fs from 'fs'
import { exit } from 'process'
import YAML from 'yaml'
import { z } from 'zod'
import { parseArgs } from 'util';
import path from 'path';

const configSchema = z.object({
	services: z.array(z.object({
		route: z.string(),
		endpoint: z.url()
	}))
})

export const getConfigPath = () => {
	const args = process.argv;
	const options = {
		conf: {
			type: 'string',
			short: 'c'
		}
	};
	const {
		values: argValues,
	} = parseArgs({ args, options, allowPositionals: true });

	var configFilePath;

	if (argValues.conf.startsWith(".")) {
		configFilePath = path.join(process.cwd(), argValues.conf.slice(2, argValues.conf.length));
	}
	else if (argValues.conf.startsWith("/")) {
		configFilePath = argValues.conf;
	}
	else {
		configFilePath = path.join(process.cwd(), argValues.conf)
	}

	return configFilePath;
}

export const readConfig = (filePath) => {
	if (filePath === undefined || filePath === null) {
		console.error("Please provide a config file")
		exit(1)
	}

	if (!fs.existsSync(filePath)) {
		console.error("File not found")
		exit(1)
	}


	const rawConf = fs.readFileSync(filePath).toString()
	var config;

	try {
		config = configSchema.parse(YAML.parse(rawConf))
	} catch (e) {
		console.error("Error in config file: ", e)
		exit(1)
	}

	return config
}
