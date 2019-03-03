const {
    assert,
    expect
} = require("chai")
const server = require("../server")
const axios = require("axios")
const testAdmin = require("./admin.test")
const mongoose = require("mongoose")
const testFab = require("./fabricant.test")
// const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer
// const mongod = new MongoMemoryServer();
// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
describe("SayaraDZ", () => {
    before(done => {
        // (async function hi() {
        //     const uri = await mongod.getConnectionString();
        //     mongoose.connect(uri, (err) => {
        //         done(err)
        //     })
        // })()
        done()
    })
    describe("Admin", () => {
        testAdmin.authenticate()
    })
    describe("Fabricants",()=>{
        testFab.list()
        testFab.create()
    } )
    after(() => {
        // mongod.stop()
        // mongoose.connection.close()
    })
})