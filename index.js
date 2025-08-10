import { getConfigPath, readConfig } from './utils/config.js';

const configFilePath = getConfigPath()
const config = readConfig(configFilePath)

console.log(config)
