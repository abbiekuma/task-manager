// server/controllers/authController.js;
import User from "../models/User.js";

// An asynchronous controller function to handle registration.
async function registerUser(req, res) {
  //Extract user info from the request body.
  let { firstName, lastName, username, password } = req.body;
  try {
    const duplicate = await User.find({ username });
    //If username exists, stop and send error response (400 Bad Request).
    if (duplicate && duplicate.length > 0) {
      return res
        .status(400)
        .send({ message: "User already registered with this username" });
    }
    //Create a new user instance. Password will be hashed automatically in the model’s pre-save hook.
    let user = new User({ firstName, lastName, username, password });
    const result = await user.save(); //Save the new user into the database.
    console.log(result);
    console.log("Received body:", req.body);

    res.status(201).send({ message: "User registered successfully!!" }); //Send a success response to the client.
  } catch (err) {
    //Catch and handle any errors that occur during the process.
    console.log(`Error: ${err}`);
    res.status(400).send(err);
  }
}
const AuthController = {
  registerUser,
};
export default AuthController;
