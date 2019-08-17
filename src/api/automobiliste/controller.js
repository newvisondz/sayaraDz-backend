const { isAutomobiliste, authenticated } = require('../../services/acl')
const { ok, notFound, internalError, conflict } = require('../../services/http')
const { createNotFoundError } = require('../utils/index')
const Model = require('./model')

exports.readMe = [
  isAutomobiliste,
  authenticated,
  async (req, res) => {
    await req.user.findCommands()
    res.json(req.user)
  }
]

exports.showProfile = [
  isAutomobiliste,
  authenticated,
  async ({ params: { id } }, res) => {
    try {
      const profile = await Model.findById(id)
      if (!profile) {
        return notFound(res, createNotFoundError('Profile', id))
      }
      ok(res, profile.profileView())
    } catch (error) {
      internalError(res, error)
    }
  }
]

exports.update = [
  isAutomobiliste,
  authenticated,
  async ({ user, body }, res, next) => {
    try {
      delete body.email
      delete body.providers
      delete body.tokens
      user.set(body)
      if (body.token) {
        const token = user.tokens.find(
          t => body.token == t
        )
        if (!token) {
          user.tokens.push(body.token)
        }
      }
      await user.save()
      res.json({
        success: true,
        ok: true,
        n: 1
      })
      next()
    } catch (error) {
      internalError(res, error)
    }
  }
]

exports.follow = [
  isAutomobiliste,
  authenticated,
  async ({ user, params: { version } }, res, next) => {
    try {
      const model = await Model.findOne({
        versions: {
          $elemMatch: {
            _id: version
          }
        }
      })
      if (!model) {
        return notFound(res, createNotFoundError('version', version))
      }
      const isFollowing = user.followedVersions.find(
        v => v == version
      )
      if (isFollowing) {
        return conflict(res, {
          success: false,
          msg: `version<${version}> already followed`
        })
      }
      user.followedVersions.push(version)
      await user.save()
      ok(res, {
        success: true
      })
    } catch (error) {
      internalError(res, error)
    }
  }
]

exports.unfollow = [
  isAutomobiliste,
  authenticated,
  async ({ user, params: { version } }, res, next) => {
    try {
      const followedVersion = user.followedVersions.find(
        v => v == version
      )
      if (!followedVersion) {
        return notFound(res, createNotFoundError('followed version', version))
      }
      user.followedVersions = user.followedVersions.filter(
        v => v != version
      )
      await user.save()
      ok(res, {
        success: true,
        ok: 1,
        n: 1
      })
    } catch (error) {
      console.error(error)
      internalError(res, error)
    }
  }
]
