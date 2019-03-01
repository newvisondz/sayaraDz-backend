const express = require("express");
const permissionController = require("./permission.controller");
const Fabricant = require("../model/fabricant.model");
const ObjectId = require("mongoose").Types.ObjectId;
const fs = require("fs-extra");
const formidable = require("formidable");

function index() {
    return [
        //permissionController.isAdmin,
        listAll
    ]
}

function create() {
    return [
        permissionController.isAdmin,
        createFabricant
    ]
}

function deleteOne() {
    return [
        permissionController.isAdmin,
        deleteFabricant
    ]
}


function listAll(req, res, next) {
    const query = Fabricant.getQueryObject(req.query);
    const perpage = parseInt(req.query.perpage);
    const page = parseInt(req.query.page);
    let skip = (page - 1) * perpage;
    skip = skip < 0 ? 0 : skip;
    Fabricant.find(query)
        .skip(skip)
        .limit(perpage)
        .select(req.query.select)
        .sort(req.query.sort)
        .then(fabricants => res.json({fabricants}))
        .catch(err => res.json(err))
}

function createFabricant(req, res, next) {
    let form = formidable.IncomingForm();
    form.maxFileSize = 20 * 1024 ** 2;
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
        if (!fields.marque) return res.json({
            error: true,
            msg: "empty marque field"
        });
        const fab = {marque: fields.marque};
        new Fabricant(fab).save()
            .then(newFab => {
                if (files.logo) {
                    let ext = files.logo.name.split(".").pop();
                    const logoPath = `public/images/${newFab.id}.${ext}`;
                    fs.copy(files.logo.path, `./${logoPath}`)
                        .then(() => {
                            newFab.logo = `/${logoPath}`;
                            res.json(newFab);
                        })
                        .catch(err => {
                            newFab.error = err;
                            res.json(newFab);
                        });
                    return
                }
                res.json(newFab);
            })
            .catch(err => {
                res.json(err);
                next(err);
            });
    });
}

async function deleteFabricant(req, res, next) {
    const isValid = ObjectId.isValid(req.params.id);
    if (!isValid) return res.json({
        error: true,
        msg: "bad fabricant id"
    });
    const fab = {
        _id: req.params.id
    };
    const result = await Fabricant.deleteOne(fab);
    res.json(result)
}

module.exports = {index, create, deleteOne};