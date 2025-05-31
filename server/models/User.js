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
  next(); // [import mongoose from "mongoose";]这里面自带的
});
/**你调用 user.save()
  ↓
Mongoose 检查有没有 pre('save') 钩子
  ↓
发现有 → 执行你的函数 (function(next) {...})
  ↓
如果密码被修改 → 加密密码
  ↓
调用 next() → 通知 mongoose：“我处理好了”
  ↓
mongoose 真正执行 `.save()`：写入 MongoDB
 */

//check the password if matched when login
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
