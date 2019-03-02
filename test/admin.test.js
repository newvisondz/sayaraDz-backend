const {
    assert,
    expect
} = require("chai")
const server = require("../server")
const axios = require("axios");

let token;
module.exports = {
    authenticate: () => describe("Authentication", () => {
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
        it("should logout", (done) => {
            axios
                .delete("http://localhost:3000/admin/logout", {
                    headers: {
                        Authorization: token
                    }
                })
                .then(response => {
                    const logout = response.data.logout
                    expect(logout).to.be.true
                    done()
                })
                .catch(err => done(err))
        })
    })
}