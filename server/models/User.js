// server/models/User.js
import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcrypt"; //Encript Password -- npm install bcrypt

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  username: { type: String, required: true },
  password: { type: String, required: true },
});

// encrypt the password when register
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  let salt = await bcrypt.genSalt(10);
  let hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});

//check the password if matched when login
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
