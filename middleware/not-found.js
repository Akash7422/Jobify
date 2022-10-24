const notFoundMiddleware = (req, res, next) => {
    res.send("Could not find the requested route")
}
export default notFoundMiddleware
