import fs from 'fs'
import { exit } from 'process'
import YAML from 'yaml'

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
		config = YAML.parse(rawConf)
	} catch (e) {
		console.error("Error in config file")
		exit(1)
	}

	return config
}
