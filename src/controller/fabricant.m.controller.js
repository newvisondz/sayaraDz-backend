const express = require("express");
const router = express.Router();
const permissionController = require("./permission.controller");
const Fabricant = require("../model/fabricant.model");

function index() {
    return [
        permissionController.isAdmin,
        listAll
    ]
}

function listAll(req, res, next) {
    const query = Fabricant.getQueryObject(req.query);
    Fabricant.find(query)
        .limit(parseInt(req.query.limit))
        .select(req.query.select)
        .sort(req.query.sort)
        .then(fabricants=> res.json(fabricants))
        .catch(err=> res.json(err))
}

module.exports = {index};