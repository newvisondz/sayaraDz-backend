// const express = require('express')
const { isAdmin, isAutomobiliste, authenticated } = require('../../services/acl')
const Manufacturer = require('./model')
// const fs = require('fs-extra')
// const formidable = require('formidable')
const Validation = require('../../services/validation')
const validate = new Validation(Manufacturer.schema)
const crud = require('../../services/crud')(Manufacturer, 'fabricant')

exports.read = [
  isAdmin,
  isAutomobiliste,
  authenticated,
  validate.filter.bind(validate),
  crud.read
]

exports.create = [
  isAdmin,
  authenticated,
  validate.requirePaths.bind(validate),
  crud.create
]

exports.update = [
  isAdmin,
  authenticated,
  crud.update
]

exports.deleteOne = [
  isAdmin,
  authenticated,
  crud.deleteOne
]

// function createManufacturer(req, res, next) {
//     let form = formidable.IncomingForm();
//     form.maxFileSize = 20 * 1024 ** 2;
//     form.keepExtensions = true;

//     form.parse(req, (err, fields, files) => {
//         if (!fields.marque) return res.json({
//             error: true,
//             msg: "empty marque field"
//         });
//         const fab = {marque: fields.marque};
//         new Manufacturer(fab).save()
//             .then(newFab => {
//                 if (files.logo) {
//                     let ext = files.logo.name.split(".").pop();
//                     const logoPath = `public/images/${newFab.id}.${ext}`;
//                     fs.copy(files.logo.path, `./${logoPath}`)
//                         .then(() => {
//                             newFab.logo = `/${logoPath}`;
//                             res.json(newFab);
//                         })
//                         .catch(err => {
//                             newFab.error = err;
//                             res.json(newFab);
//                         });
//                     return
//                 }
//                 res.json(newFab);
//             })
//             .catch(err => {
//                 res.json(err);
//                 next(err);
//             });
//     });
// }
