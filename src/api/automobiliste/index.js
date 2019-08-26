const express = require('express')
const router = express.Router()
const { bids, readMe, update, follow, unfollow, showProfile, updateProfilePicture } = require('./controller')
const { updatePaymentAccount, updatePaymentExternalAccount } = require('./account')

router.get('/me', readMe)
router.get('/me/bids', bids)
router.put('/me', update)
router.put('/me/payment-account', updatePaymentAccount)
router.put('/me/external-payment-account', updatePaymentExternalAccount)
router.put('/me/picture', updateProfilePicture)
router.get('/:id', showProfile)

router.post('/follow/versions/:version', follow)
router.delete('/unfollow/versions/:version', unfollow)

module.exports = router
