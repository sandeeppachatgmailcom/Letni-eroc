const mongoose = require('mongoose')
const db = require('../model/mongoose')

const newImageRecord = new mongoose.Schema({
    Documentindex: {type: String} ,
    collectionName: { type: String },
    ImageRecordIndex: { type: String },
    imageField: { type: String },
    currentImage: { type: String },
  });
const ImageDoc = db.model('ImageDoc',newImageRecord)
 

module.exports = {ImageDoc}