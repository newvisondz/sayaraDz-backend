var mongoose = require('mongoose')

const express = require('express')
const router = new express.Router()

router.get('/:filename', async ({ params: { filename } }, res, next) => {
  let Grid = require('gridfs-stream')
  Grid.mongo = mongoose.mongo
  let conn = mongoose.connection
  let gfs = Grid(conn.db)
  gfs.files.find({ filename }).toArray((err, files) => {
    if (err) return res.status(500)
    if (!files || files.length === 0) {
      return res.status(404).json({
        error: true,
        code: 404,
        msg: 'file not found'
      })
    }
    gfs.createReadStream({
      filename
    }).pipe(res)
  })
})

module.exports = router
