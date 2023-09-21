const express = require('express');
const router = express.Router()
const deleteAccount = require('../Controller/deleteAcct')


router.delete('/', deleteAccount)


module.exports = router