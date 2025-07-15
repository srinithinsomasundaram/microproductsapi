module.exports = function checkApiKey(req, res, next) {
  const key = req.headers["x-api-key"]
  if (!key || key !== process.env.PRODUCT_SERVICE_KEY) {
    return res.status(401).json({ message: "Unauthorized" })
  }
  next()
}
