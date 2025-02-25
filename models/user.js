const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  name: {
    type: String,
    require: true,
  },
  surname: String,

  nick: {
    type: String,
  },

  bio: {
    type:String,
  },

  email: {
    type: String,
    require: true,
  },

  password: {
    type: String,
    require: true,
  },

  role: {
    type: String,
    default: "role_User",
  },

  image: {
    type: String,
    default: "default.png",
  },
  create_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("user", UserSchema, "users");
