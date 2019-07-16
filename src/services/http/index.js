
exports.ok = (res, data) => {
  return res.status(200).json(data)
}
exports.created = (res, data) => {
  return res.status(201).json(data)
}
exports.conflict = (res, data) => {
  return res.status(409).json(data)
}
exports.deleted = (res, data) => {
  return res.status(204).json(data)
}
exports.badRequest = (res, data) => {
  return res.status(400).json(data)
}
exports.unauthorized = (res) => {
  return res.status(401).json({
    error: true,
    msg: 'permission denied'
  })
}
exports.notFound = (res, data) => {
  return res.status(404).json(data)
}
exports.internalError = (res, data) => {
  return res.status(500).json(data)
}
