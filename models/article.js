const mongoose = require('mongoose');
const valid = require('validator');
const mess = require('../configs/message');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: [true, mess.KEYWORD_REQUIRED],
  },
  title: {
    type: String,
    required: [true, mess.TITLE_REQUIRED],
  },
  text: {
    type: String,
    required: [true, mess.TEXT_REQUIRED],
  },
  date: {
    type: String,
    required: [true, mess.DATE_REQUIRED],
  },
  source: {
    type: String,
    required: [true, mess.SOURCE_REQUIRED],
  },
  link: {
    type: String,
    required: [true, mess.LINK_REQUIRED],
    validate: {
      validator(v) {
        return valid.isURL(v);
      },
      message: mess.ERR_FORMAT,
    },
  },
  image: {
    type: String,
    required: [true, mess.IMAGE_REQUIRED],
    validate: {
      validator(v) {
        return valid.isURL(v);
      },
      message: mess.ERR_FORMAT,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
    select: false,
  },
});
module.exports = mongoose.model('article', articleSchema);
