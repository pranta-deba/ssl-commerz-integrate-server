import { catchAsync } from "../../utils/catchAsync.js";
import { UserServices } from "./user.services.js";

const createUser = catchAsync(async (req, res) => {
  const result = await UserServices.createUserIntoDB(req.body);

  res.send({
    success: true,
    data: result,
    message: "User Created Successfully.",
  });
});

export const UserControllers = {
  createUser,
};
