const mongoose = require("mongoose");

// SCHEMA SETUP
// set the schema of the inputs to DB
const campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    author : {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      username: String,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
      }
    ]

})
// initialize the schema
module.exports = mongoose.model("Campground", campgroundSchema);
