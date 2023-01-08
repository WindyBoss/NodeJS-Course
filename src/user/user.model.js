const mongoose = require("mongoose");
const {
  Schema,
  Types: { ObjectId },
} = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String, required: false },
  favouriteFilmIds: [{ type: ObjectId, ref: "Film" }],
});

userSchema.statics.findUserByIdAndUpdate = findUserByIdAndUpdate;
userSchema.statics.findUserByEmail = findUserByEmail;
userSchema.statics.updateToken = updateToken;

function findUserByIdAndUpdate(id, data) {
  return this.findByIdAndUpdate(id, { $set: data }, { new: true });
}

async function findUserByEmail(email) {
  return await this.findOne({ email });
}

async function updateToken(id, newToken) {
  return this.findByIdAndUpdate(
    id,
    { $set: { token: newToken } },
    { new: true }
  );
}

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
