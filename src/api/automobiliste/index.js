const express = require('express')
const router = express.Router()
const { readMe, update, follow, unfollow, showProfile } = require('./controller')

router.get('/me', readMe)
router.put('/me', update)
router.get('/:id', showProfile)

router.post('/follow/versions/:version', follow)
router.delete('/unfollow/versions/:version', unfollow)

module.exports = router
