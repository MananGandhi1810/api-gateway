import { parseArgs } from 'util';
import { readConfig } from './utils/config.js';
import path from 'path';

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

const config = readConfig(configFilePath)

console.log(config)
