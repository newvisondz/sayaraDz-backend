const express = require('express')
const router = express.Router()
const {
  bids,
  readMe,
  update,
  follow,
  unfollow,
  showProfile,
  updateProfilePicture,
  usedCars
  // stripeKeys
} = require('./controller')

router.get('/me', readMe)
router.get('/me/bids', bids)
router.get('/me/usedCars', usedCars)
// router.post('/me/stripe-keys', stripeKeys)

router.put('/me', update)
// router.put('/me/payment-account', updatePaymentAccount)
// router.put('/me/external-payment-account', updatePaymentExternalAccount)
router.put('/me/picture', updateProfilePicture)
router.get('/:id', showProfile)

router.post('/follow/versions/:version', follow)
router.delete('/unfollow/versions/:version', unfollow)

module.exports = router
