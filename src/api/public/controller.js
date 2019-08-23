const mongoose = require('mongoose')
const Grid = require('gridfs-stream')
const sharp = require('sharp')

exports.show = async ({ params: { filename } }, res, next) => {
  try {
    const file = await getFileStream(filename)
    file.pipe(res)
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.thumbnail = async ({ params: { filename } }, res) => {
  try {
    const transform = sharp().resize(150, 150)
    const file = await getFileStream(filename)
    file.pipe(transform).pipe(res)
  } catch (error) {
    res.status(400).json(error)
  }
}

const getFileStream = (filename) => new Promise((resolve, reject) => {
  Grid.mongo = mongoose.mongo
  let conn = mongoose.connection
  let gfs = Grid(conn.db)

  gfs.files.find({ filename }).toArray((err, files) => {
    if (err) return reject(err)
    if (!files || files.length === 0) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return reject({
        error: true,
        code: 404,
        msg: 'file not found'
      })
    }

    resolve(
      gfs.createReadStream({
        filename
      })
    )
  })
})
