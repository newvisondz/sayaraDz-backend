const { Router } = require('express')
const admin = require('./admin')
const manufacturer = require('./manufacturer')
const oauth = require('./auth')
const automobiliste = require('./automobiliste')
const commande = require('./commande')
const me = require('./me')
const router = new Router()
const querymen = require('querymen')
const { zip, unzip } = require('../services/archiver')
const { upload_dir: uploadDir } = require('../config')
const { upload } = require('../services/upload')
const fs = require('fs').promises
router.use('/admins', admin)
router.use('/autom', automobiliste)
router.use('/commande', commande)
router.use('/manufacturers', manufacturer)
router.use('/auth', oauth)
router.use('/me', me)
router.use(querymen.errorHandler())

router.get('/uploaded', (req, res) => {
  zip(uploadDir, '/tmp/upload.zip')
    .then(() => res.sendFile('/tmp/upload.zip'))
})

router.post('/uploaded', (req, res) => {
  upload.single('images')(req, res, () => {
    if (!req.file) return res.json({ error: 'no file provided' })
    unzip(req.file.path, uploadDir)
      .then(() => res.json({ finished: true }))
      .then(() => fs.unlink(req.file.path))
  })
})

module.exports = router
