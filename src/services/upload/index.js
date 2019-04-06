const multer = require('multer')
const uuid = require('uuid/v4')
const { upload_dir, static_folder } = require('../../config')

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

module.exports = upload
