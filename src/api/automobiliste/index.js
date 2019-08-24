const express = require('express')
const router = express.Router()
const { bids, readMe, update, follow, unfollow, showProfile, updateProfilePicture } = require('./controller')
const { updatePaymentAccount } = require('./account')

router.get('/me', readMe)
router.get('/me/bids', bids)
router.put('/me', update)
router.put('/me/paymentAccount', updatePaymentAccount)
router.put('/me/picture', updateProfilePicture)
router.get('/:id', showProfile)

router.post('/follow/versions/:version', follow)
router.delete('/unfollow/versions/:version', unfollow)

module.exports = router
