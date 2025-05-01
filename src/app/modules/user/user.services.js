import User from "./user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config/index.js";

const createUserIntoDB = async (payload) => {
  try {
    const result = await User.create(payload);
    return result;
  } catch (error) {
    throw error;
  }
};

const loginUserIntoDB = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordMatched = bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Incorrect password");
  }

  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    config.jwt_access_secret,
    {
      expiresIn: config.jwt_access_expires_in || "1d",
    }
  );

  return {
    user,
    token,
  };
};

export const UserServices = {
  createUserIntoDB,
  loginUserIntoDB,
};
