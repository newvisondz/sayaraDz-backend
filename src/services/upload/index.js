const multer = require('multer')
const uuid = require('uuid/v4')
const { without } = require('../../api/utils')
const mongoose = require('mongoose')

const storage = require('multer-gridfs-storage')({
  url: process.env.mongoUrl,

  filename: (req, file, next) => {
    const ext = file.originalname.split('.').pop()
    const name = uuid(file.originalname) + '.' + ext
    next(null, name)
  }
})

const upload = multer({ storage })

exports.upload = upload

const deleteImages = (images) => new Promise((resolve, reject) => {
  let Grid = require('gridfs-stream')
  Grid.mongo = mongoose.mongo
  let conn = mongoose.connection
  let gfs = Grid(conn.db)
  images = images.map(i => i.split('/').pop())
  gfs.files.find({ filename: { $in: images } }).toArray((err, files) => {
    if (err) return reject(err)
    if (!files || files.length === 0) {
      reject(new Error('no files'))
    }
    images.forEach(
      filename => gfs.remove({ filename }, console.error)
    )
    resolve()
  })
})

exports.deleteImages = deleteImages

const mergeImageBody = (files, bodyImages, images) => {
  bodyImages = bodyImages && JSON.parse(bodyImages)
  return [
    ...(bodyImages || images),
    ...files.map(
      file => `/public/${file.filename}`
    )
  ]
}
exports.mergeImageBody = mergeImageBody

module.exports.createImages = (req, res) => new Promise(
  (resolve, reject) => {
    upload.array('images')(req, res,
      async (error) => {
        if (error) return reject(error)
        const { files } = req
        if (!files) return resolve()
        let images = files.map(
          image => '/public/' + image.filename
        )
        resolve(images)
      })
  }
)

exports.updateImages = (req, res, originalImages) => new Promise(
  (resolve, reject) => {
    upload.array('newImages')(req, res,
      async (error) => {
        if (error) return reject(error)
        const { files, body } = req
        if (!files || !files.length) {
          return resolve(
            body.images && JSON.parse(body.images)
          )
        }
        let images = mergeImageBody(files, body.images, originalImages)
        await deleteImages(without(originalImages, images))
        resolve(images)
      }
    )
  }
)
