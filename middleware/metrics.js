export const generateMetrics = (req, res, next) => {
    const start = Date.now()
    res.on("finish", () => {
        const end = Date.now()
        const responseTime = start - end
    })
    next()
}
