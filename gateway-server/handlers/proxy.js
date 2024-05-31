const { createProxyMiddleware } = require("http-proxy-middleware");
var { decrypt } = require("../utils/encryption");

require("dotenv").config();

const proxyHandler = async (req, res) => {
  const { project, endpoint } = req.params;
  const { endpointRecord, projectRecord } = req;

  if (endpointRecord.url.endsWith("/")) {
    endpointRecord.url = endpointRecord.url.slice(0, -1);
  }

  const proxy = createProxyMiddleware({
    target:
      endpointRecord.url +
      req.originalUrl.replace(`/${project}/${endpoint}`, ""),
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq, req, res) => {
        endpointRecord.injections.forEach((injection) => {
          if (injection.type.toLowerCase() == "header") {
            proxyReq.setHeader(
              injection.key,
              decrypt(injection.value, process.env.KEY_ENCRYPTION_SECRET)
            );
            console.log(proxyReq.getHeaders());
          }
        });
      },
      proxyRes: (proxyRes, req, res) => {
        res.statusCode = proxyRes.statusCode;
      },
    },
  });

  proxy(req, res);
};

module.exports = {
  proxyHandler,
};
