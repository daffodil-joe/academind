const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  //   included in theschema is a array of created events, it contains ObjectId of all the events created  by a user. It must contain ref since there is otherwise no metadata in the ObjectId to tell mongo what this id refrences.
  createdEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
