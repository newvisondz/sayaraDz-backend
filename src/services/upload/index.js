const multer = require('multer')
const uuid = require('uuid/v4')
const { upload_dir } = require('../../config')
const fs = require('fs')
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

module.exports.upload = multer({ storage })

module.exports.deleteImages = (images) => new Promise((resolve, reject) => {
  console.log({ images })
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

module.exports.mergeImageBody = (files, bodyImages, images) => {
  bodyImages = bodyImages && JSON.parse(bodyImages)
  return [
    ...(bodyImages || images),
    ...files.map(
      file => `/public/${file.filename}`
    )
  ]
}
