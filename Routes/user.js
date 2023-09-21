const express = require('express');
const router = express.Router()
const {updateProfile, getUser, followUser, unFollowUser, createProfile} = require('../Controller/user')

router.post('/createprofile', createProfile)
router.patch('/updateprofile', updateProfile)
router.get('/getuserprofile', getUser)
router.patch('/:id/follow', followUser)
router.patch('/:id/unfollow', unFollowUser)

module.exports = router