const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: [true, 'поле "keyword" должно быть заполнено'],
  },
  title: {
    type: String,
    required: [true, 'поле "title" должно быть заполнено'],
  },
  text: {
    type: String,
    required: [true, 'поле "text" должно быть заполнено'],
  },
  date: {
    type: String,
    required: [true, 'поле "date" должно быть заполнено'],
  },
  source: {
    type: String,
    required: [true, 'поле "source" должно быть заполнено'],
  },
  link: {
    type: String,
    required: [true, 'поле "link" должно быть заполнено'],
    validate: {
      validator(v) {
        return v.match(/^https?:\/{2}[w{3}\\.]{0,1}[^\\/][\w\W]{1,}#?$/gi);
      },
      message: 'Неверный формат!',
    },
  },
  image: {
    type: String,
    required: [true, 'поле "image" должно быть заполнено'],
    validate: {
      validator(v) {
        return v.match(/^https?:\/{2}[w{3}\\.]{0,1}[^\\/][\w\W]{1,}#?$/gi);
      },
      message: 'Неверный формат!',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',

  },
});
module.exports = mongoose.model('article', articleSchema);
