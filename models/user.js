const mongoose = require('mongoose');
const { default: validator } = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'поле "email" должно быть заполнено'],
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'Неверный формат!',
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'поле "password" должно быть заполнено'],
    minlength: [8, 'минимальная длина поля "password" - 8'],
    select: false,
  },
  name: {
    type: String,
    required: [true, 'поле "password" должно быть заполнено'],
    minlength: [2, 'минимальная длина поля "name" - 2'],
    maxlength: [30, 'максимальная длина поля "name" - 30'],
  },
});

module.exports = mongoose.model('user', userSchema);
