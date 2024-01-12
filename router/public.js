const express = require('express')
const router = express.Router()
const publiccontroller = require('../router/publicApi')


router.get('/hotels',publiccontroller.getHotels)

module.exports = router
