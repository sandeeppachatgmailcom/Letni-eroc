

const express = require('express')
const router = express.Router()
const fntcompany = require('../functions/company')


const getHotels = async (req, res) => {
    console.log(req.body);
    const company = await fntcompany.company.find({ Active: true, deleted: false })
    res.json(company)
}


module.exports = { getHotels }