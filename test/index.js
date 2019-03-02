const {assert,expect} = require("chai")
const server = require("../server")
const axios = require("axios")
const testAdmin = require("./admin.test")

describe("SayaraDZ", () => {
    describe("Admin", () => {
        testAdmin.authenticate()
    })
    after(() => {})
})