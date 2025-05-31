// server/controllers/authController.js;
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.JWT_SECRET;

// An asynchronous controller function to handle registration.
async function registerUser(req, res) {
  //Extract user info from the request body.
  let { firstName, lastName, username, password } = req.body;
  try {
    //1️⃣ check if the user already exist.
    const duplicate = await User.find({ username });
    //If username exists, stop and send error response (400 Bad Request).
    if (duplicate && duplicate.length > 0) {
      return res
        .status(400)
        .send({ message: "User already registered with this username" });
    }
    //2️⃣ create user, and the password will automatically encrypt
    //Create a new user instance. Password will be hashed automatically in the model’s pre-save hook.
    let user = new User({ firstName, lastName, username, password });
    const result = await user.save();
    /**user.save() →
        ⤷ 执行 pre('save') 钩子 → 加密密码
            ⤷ 保存到 MongoDB
                ⤷ 执行 .then() → 响应注册成功
 */
    console.log(result);
    console.log("Received body:", req.body);
    //3️⃣ send the sucessfully register massage
    res.status(201).send({ message: "User registered successfully!!" }); //Send a success response to the client.
  } catch (err) {
    //Catch and handle any errors that occur during the process.
    console.log(`Error: ${err}`);
    res.status(400).send(err);
  }
}

async function loginUser(req, res) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send({ error: "Authentication Failed!" });
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res
        .status(404)
        .send({ error: "You entered the wrong password:(" });
    }
    let token = jwt.sign({ userId: user?.id }, secretKey, {
      expiresIn: "1h",
    });
    let finalData = {
      userID: user?.id,
      username: user?.username,
      firstName: user?.firstName,
      lastName: user?.lastName,
      token,
    };
    res.send(finalData);
  } catch (err) {
    console.log(`loginUser Error: ${err}`);
    res.status(400).send(err);
  }
}

const AuthController = {
  registerUser,
  loginUser,
};
export default AuthController;
