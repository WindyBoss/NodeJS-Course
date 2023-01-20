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
  status: {
    type: String,
    required: true,
    default: "Created",
    enum: ["Verified", "Created"],
  }, // enum - one of [array]
  verificationToken: { type: String, required: false },
  favouriteFilmIds: [{ type: ObjectId, ref: "Film" }],
});

userSchema.statics.findUserByIdAndUpdate = findUserByIdAndUpdate;
userSchema.statics.findUserByEmail = findUserByEmail;
userSchema.statics.updateToken = updateToken;
userSchema.statics.createVerificationToken = createVerificationToken;
userSchema.statics.findVerificationToken = findVerificationToken;
userSchema.statics.verifyUser = verifyUser;
userSchema.statics.addFilmForUser = addFilmForUser;
userSchema.statics.removeFilmForUser = removeFilmForUser;

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

async function createVerificationToken(id, verificationToken) {
  return this.findByIdAndUpdate(
    id,
    {
      verificationToken,
    },
    {
      new: true,
    }
  );
}

async function verifyUser(userId) {
  return this.findByIdAndUpdate(
    userId,
    {
      status: "Verified",
      verificationToken: null,
    },
    { new: true }
  );
}

async function addFilmForUser(userId, filmId) {
  await userModel.findOneAndUpdate(
    userId,
    {
      $push: { favouriteFilmIds: filmId },
    },
    { new: true }
  );

  return await this.aggregate([
    { $match: { _id: userId } },
    {
      $lookup: {
        from: "films",
        localField: "favouriteFilmIds",
        foreignField: "_id",
        as: "films",
      },
    },
  ]);
}

async function removeFilmForUser(userId, filmId) {
  return await this.findOneAndUpdate(
    userId,
    {
      $pull: { favouriteFilmIds: filmId },
    },
    { new: true }
  ).populate("favouriteFilmIds");
}

async function findVerificationToken(verificationToken) {
  return this.findOne({ verificationToken });
}

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
