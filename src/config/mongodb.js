/* eslint-disable no-undef */
const mongoose = require("mongoose");

mongoose.connect(
  `${process.env.MONGODB_STRING}/${process.env.MONGODB_DATABASE}?authSource=admin&retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  }
);
mongoose.Promise = global.Promise;

module.exports = {
  mongoose,
};
