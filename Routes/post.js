const express = require('express');
const router = express.Router()
const {createPost,deletePost,likePost,updatePost,getAllPosts, getPosts, getAllUserPosts} = require('../Controller/post')

router.post('/createpost', createPost)
router.patch('/:id/updatepost', updatePost)
router.delete('/:id/deletepost', deletePost)
router.get('/:id/getpost', getPosts)
router.get('/getposts', getAllPosts)
router.get('/getalluserposts', getAllUserPosts)
router.patch('/:id/like', likePost)


module.exports = router