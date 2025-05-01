import User from "./user.model.js";

const createUserIntoDB = async (payload) => {
  try {
    const result = await User.create(payload);
    return result;
  } catch (error) {
    throw error;
  }
};

export const UserServices = {
  createUserIntoDB,
};
