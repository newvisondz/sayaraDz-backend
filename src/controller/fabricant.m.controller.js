const express = require("express");
const router = express.Router();
const permissionController = require("./permission.controller");
const Fabricant = require("../model/fabricant.model");
const ObjectId = require("mongoose").Types.ObjectId;

function index() {
    return [
        permissionController.isAdmin,
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
    Fabricant.find(query)
        .skip((page - 1) * perpage)
        .limit(perpage)
        .select(req.query.select)
        .sort(req.query.sort)
        .then(fabricants => res.json({fabricants}))
        .catch(err => res.json(err))
}

function createFabricant(req, res, next) {
    const fab = {
        marque: req.body.marque
    };
    if (!fab.marque)
        return res.json({
            error: true,
            msg: "empty marque field"
        });

    new Fabricant(fab).save()
        .then(newFab=> res.json(newFab))
        .catch(err=> {
            res.json(err);
            next(err);
        })

}

async function deleteFabricant(req, res, next){
    const isValid = ObjectId.isValid(req.params.id);
    if(!isValid)return res.json({
        error: true,
        msg: "bad fabricant id"
    });
    const fab = {
        _id: req.params.id
    };
    const result = await  Fabricant.deleteOne(fab);
    res.json(result)
}

module.exports = {index, create, deleteOne};