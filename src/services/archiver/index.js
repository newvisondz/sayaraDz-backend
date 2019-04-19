const fs = require('fs')
const archiver = require('archiver')
const AdmZip = require('adm-zip')
const archive = archiver('zip')

exports.zip = (src, dest) => new Promise(
  (resolve, reject) => {
    let out = fs.createWriteStream(dest)
    out.on('close', () => resolve())
    out.on('end', () => resolve())
    archive.on('error', (error) => reject(error))
    archive.pipe(out)
    archive.directory(src, false)
    archive.finalize()
  }
)

exports.unzip = (src, dest) => new Promise((resolve, reject) => {
  let zip = new AdmZip(src)
  zip.extractAllToAsync(dest, true,   (error) => {
    if (error) return reject(error)
    resolve()
  })
})
