import { getMessaging } from "firebase-admin/messaging";
import { success, error } from "../utils/sendfunction.js";
import { Pushmodel } from "../model/Pushmodel.js";

export const settoken = async (req, res) => {
  try {
    const { token, id } = req.body;
    console.log(token);
    if (!token) {
      return res.send(error(400, "token is required"));
    }

    const oldtoken = await Pushmodel.findOne({ token: token });
    if (oldtoken) {
      return res.send(error(409, "Token is already in the database"));
    }

    const settoken = new Pushmodel({
      token: token,
      id: id,
    });
    await settoken.save();
    return res.send(success(200, "token saved in the database"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

export const gettoken = async (req, res) => {
  try {
    const token = await Pushmodel.find();
    return res.send(success(200, { token }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};
export const sendMessage = async (req, res) => {
  try {
    let { token, title, body } = req.body;
    console.log(token);
    if (!token) {
      return res.send(error(400, "Token is required"));
    }
    const message = {
      notification: {
        title,
        body,
      },
      tokens: token
    };

    const data = await getMessaging().sendEachForMulticast(message);
    console.log(" sdata", data);

    return res.send(success(200, "Message sent successfully"));
  } catch (e) {
    console.error("Error sending notification:", e.message);

    res.send(error(500, e.message));
  }
};
