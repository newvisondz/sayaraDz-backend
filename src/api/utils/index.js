const jsonwebtoken = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const keys = require("../../config")

const USER_TYPE = {
    ADMIN: "ADMIN",
    AUTOMOBILISTE: "AUTOMOBILISTE",
    FABRICANT: "FABRICANT"
}

function sign() {
    return "bearer " + jsonwebtoken.sign({
        id: this.id,
        type: this.type
    }, keys.jwt_key, {
        expiresIn: "1d",
    })
}

function isValidPasswd(password, cb) {
    bcrypt.compare(password, this.password)
        .then(isValid => {
            console.log({
                isValid
            })
            cb(null, isValid)
        })
        .catch(err => cb(err))
}

function preSaveUser(next) {
    const user = this
    if (!user.isModified("password")) {
        return next()
    }
    bcrypt.hash(this.password, 12)
        .then(hash => {
            this.password = hash
            next()
        })
        .catch(err => {
            next(err)
        })
}

const getFabQueryObject = (query) => {
    let {
        email,
        password,
        firstName,
        lastName,
        address,
        phone,
        isAdmin,
        createdAt,
        updatedAt,
        manufacturer
    } = query
    const q = {
        email,
        password,
        firstName,
        lastName,
        address,
        phone,
        isAdmin,
        createdAt,
        updatedAt,
        manufacturer
    }
    for (let prop in q)
        if (!q[prop]) delete q[prop]

    return q
}

const getAdminQueryObject = (query) => {
    let {
        email,
        password,
        createdAt,
        updatedAt
    } = query
    const q = {
        email,
        password,
        createdAt,
        updatedAt
    }
    for (let prop in q)
        if (!q[prop]) delete q[prop]
    return q
}

module.exports = {
    USER_TYPE,
    sign,
    isValidPasswd,
    preSaveUser,
    getAdminQueryObject,
    getFabQueryObject
}