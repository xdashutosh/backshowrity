import { error, success } from "../utils/sendfunction.js";
import { Adminauth } from "../model/Adminauth.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signupcontroller = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.send(error(400, "All fields are required"));
    }

    const olduser = await Adminauth.findOne({ email: email });
    if (olduser) {
      return res.send(error(409, "User already exists"));
    }

    const hashedpassword = await bcrypt.hash(password, 10);
    const user = await Adminauth.create({
      email,
      password: hashedpassword,
    });
    return res.send(success(200, "User Signup succesfully"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

export const logincontroller = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.send(error(400, "All fields are required"));
    }
    const user = await Adminauth.findOne({ email: email });
    if (!user) {
      return res.send(error(404, "User is not registered"));
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      // return res.status(403).send("Incorrect password");
      return res.send(error(403, "Incorrect password"));
    }
    const accessToken = jwt.sign(
      { _id: user._id, email: user.email },
      "ksehgiuhkdfhgsygbkjldfghisgjghjjyghghfggjkjkjj",
      {
        expiresIn: "1d",
      }
    );
    return res.send(success(200, { accessToken }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

