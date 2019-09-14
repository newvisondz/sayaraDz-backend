const multer = require('multer')
const uuid = require('uuid/v4')
const { without } = require('../../api/utils')
const mongoose = require('mongoose')
const path = require('path')

const extensions = ['png', 'jpg', 'jpeg', 'bmp', 'svg']

const storage = require('multer-gridfs-storage')({
  url: process.env.mongoUrl,
  file: (req, file) => {
    return {
      filename: uuid(file.originalname)
    }

    // if (file.mimetype.includes('image')) {
    //   return {
    //     filename: uuid(file.originalname)
    //   }
    // } else {
    //   // eslint-disable-next-line no-throw-literal
    //   throw {
    //     error: true,
    //     msg: 'format not accepted'
    //   }
    // }
  },
  filename: (req, file, next) => {
    const ext = file.originalname.split('.').pop()
    const name = uuid(file.originalname) + '.' + ext
    console.log({ file })
    next(null, name)
  },
  fileFilter: (req, file, cb) => {
    console.log(path.extname(file.originalname))
    if (!extensions.include(path.extname(file.originalname))) {
      // eslint-disable-next-line standard/no-callback-literal
      return cb({
        error: true,
        msg: 'file not acceted'
      })
    }
    cb(null, true)
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
