const mongoose = require('mongoose');
const { default: validator } = require('validator');
const mess = require('../configs/message');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, mess.EMAIL_REQUIRED],
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: mess.ERR_FORMAT,
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, mess.PASSWORD_REQUIRED],
    select: false,
  },
  name: {
    type: String,
    required: [true, mess.NAME_REQUIRED],
    minlength: [2, mess.NAME_MIN],
    maxlength: [30, mess.NAME_MAX],
  },
});

module.exports = mongoose.model('user', userSchema);
