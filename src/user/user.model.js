const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * Schema - model - limitation (validation) for object field, added to MongoDB
 */
const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  films: [{ name: { type: String } }],
});

userSchema.statics.findUserByIdAndUpdate = findUserByIdAndUpdate;

function findUserByIdAndUpdate(id, data) {
  // - custom function
  return this.findByIdAndUpdate(id, { $set: data }, { new: true });
}

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
