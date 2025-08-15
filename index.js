import { getConfigPath, readConfig } from "./utils/config.js";
import express from "express";
import cors from "cors";
import proxy from "express-http-proxy";
import { generateMetrics } from "./middleware/metrics.js";

const configFilePath = getConfigPath();
const config = readConfig(configFilePath);
const port = process.env.PORT || config.port || 1810;

const app = express();
app.use(
    cors({
        origin: config.allowed_origins.includes("*")
            ? true
            : config.allowed_origins,
    }),
);

app.use(generateMetrics)

config.services.forEach((service) => {
    app.use(
        service.route,
        proxy(service.endpoint, {
            proxyReqPathResolver: (req) => {
                req.locals = { service: service.name }
                return req.originalUrl.slice(service.route.length,)
            }
        }),
    );
});

app.listen(port, () => {
    console.log(`API Gateway is running on http://localhost:${port}`);
});
