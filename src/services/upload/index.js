const multer = require('multer')
const uuid = require('uuid/v4')
const { upload_dir } = require('../../config')
const fs = require('fs')
const { without } = require('../../api/utils')
const storage = multer.diskStorage({
  destination: (req, file, next) => {
    next(null, upload_dir)
  },
  filename: (req, file, next) => {
    const ext = file.originalname.split('.').pop()
    const name = uuid(file.originalname) + '.' + ext
    next(null, name)
  }
})
const upload = multer({ storage })
module.exports.upload = upload

const deleteImages = (images) => new Promise((resolve, reject) => {
  if (!images.length) resolve()
  let rejected = 0
  for (let image of images) {
    const path = upload_dir + '/' + image.split('/').pop()
    fs.unlink(path, (err) => {
      if (err) return reject(err)
      rejected++
      if (rejected == images.length) resolve()
    })
  }
})
module.exports.deleteImages = deleteImages

const mergeImageBody = (files, bodyImages, images) => {
  bodyImages = bodyImages && JSON.parse(bodyImages)
  return [
    ...(bodyImages || images),
    ...files.map(
      file => `/public/${file.filename}`
    )
  ]
}
module.exports.mergeImageBody = mergeImageBody

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

module.exports.updateImages = (req, res, originalImages) => new Promise(
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

// const deleteImages = (images) => Promise.all(images.map(
//   img => new Promise((resolve, reject) => {
//     const path = upload_dir + '/' + img.split('/').pop()
//     fs.unlink(path, (err) => {
//       if (err) return reject(err)
//       resolve()
//     })
//   })
// ))
