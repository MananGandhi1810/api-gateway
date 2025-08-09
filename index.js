import fs from 'fs'
import YAML from 'yaml'
import { parseArgs } from 'util';
import { exit } from 'process';

const args = process.argv;
const options = {
	conf: {
		type: 'string',
		short: 'c'
	}
};
const {
	values,
} = parseArgs({ args, options, allowPositionals: true });

if (values.conf === undefined || values.conf === null) {
	console.error("Please provide a config file")
	exit(1)
}

if (!fs.existsSync(values.conf)) {
	console.error("File not found")
	exit(1)
}


const rawConf = fs.readFileSync(values.conf).toString()
var config

try {
	config = YAML.parse(rawConf)
} catch (e) {
	console.error("Error in config file")
	exit(1)
}


console.log(config)
