const mongoose = require('mongoose')


var personSchema = new mongoose.Schema({
    tags: [{type: String}]
  });



module.exports = mongoose.model("meeting2", personSchema)