import { getConfigPath, readConfig } from './utils/config.js';
import express from 'express'
import proxy from 'express-http-proxy'

const configFilePath = getConfigPath()
const config = readConfig(configFilePath)
const port = process.env.PORT || config.port || 1810

const app = express()

config.services.forEach((service) => {
	app.all(service.route, proxy(service.endpoint, {
		proxyReqPathResolver: req => req.path.slice(service.route.length,)
	}))
})

app.listen(port, () => {
	console.log(`API Gateway is running on http://localhost:${port}`)
})

