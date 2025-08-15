export const generateMetrics = (req, res, next) => {
    const start = Date.now()
    res.on("finish", () => {
        const end = Date.now()
        const responseTime = end - start
        var service
        if (!req.locals || !req.locals.service) {
            service = ""
        }
        else {
            service = req.locals.service
        }
        const metrics = {
            responseTime,
            service,
            originalPath: req.originalUrl,
            path: req.path,
            userAgent: req.get("User-Agent")
        }
        console.log(metrics)
    })
    next()
}
