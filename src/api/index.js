const {Router} = require("express")

const admin = require("./admin")
const manufacturer = require("./manufacturer")
const manufacturerAdmin = require("./manufacturer-admin")
const manufacturerUser = require("./manufacturer-user")
const oauth = require("./auth")

const router = new Router()

router.use('/admin', admin)
router.use('/fabricant', manufacturer)
router.use('/fabricant/admin', manufacturerAdmin)
router.use('/fabricant/user', manufacturerUser)
router.use("/auth", oauth)

module.exports = router
