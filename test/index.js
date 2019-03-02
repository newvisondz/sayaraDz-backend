const {
    assert,
    expect
} = require("chai")
const server = require("../server")
const axios = require("axios")

let token ;
describe("SayaraDZ", () => {
    before((done) => {
        axios
            .post("http://localhost:3000/admin/login", {
                email: "akram@esi.dz",
                password: "root"
            })
            .then(response => {
                token = response.data.token
                done()
            })
    })

    describe("Admin", () => {
        describe("Authentication", () => {
            it("should return a token", (done) => {
                axios
                    .post("http://localhost:3000/admin/login", {
                        email: "akram@esi.dz",
                        password: "root"
                    })
                    .then(response => {
                        const {
                            error,
                            token
                        } = response.data
                        expect(error).to.be.undefined
                        expect(token).not.be.undefined
                        done()
                    })
                    .catch((err, response) => {
                        done(err)
                    })
            })
        })
       
    })
    after(() => {})
})