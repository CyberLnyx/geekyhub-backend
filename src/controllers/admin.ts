import { Request, Response } from "express";
import { Admin } from "../models";
import { StatusCodes } from "http-status-codes";
import _ from "lodash";
import {
  throwBadRequestError,
  throwUnauthorizedError,
  throwNotFoundError,
  sendSuccessResponse,
  throwUnprocessableEntityError,
  generateOtp,
  sendOtpEmail,
  verifyOTP,
} from "../helpers";
import { throwErrorIfBodyIsEmpty } from "../utils";

export const register = async function (req: Request, res: Response) {
  const data = req.body;
  throwErrorIfBodyIsEmpty(
    data,
    ["email", "password"],
    "Please provide all fields"
  );
  const newAdmin = await Admin.create(data);
  const userWithoutPassword = _.omit(newAdmin.toObject(), "password");
  userWithoutPassword.userId = userWithoutPassword._id;
  const { userId, email } = userWithoutPassword;
  const accessToken = newAdmin.generateToken({ userId, email });
  return sendSuccessResponse(
    res,
    {
      message: "Admin account created successfully",
      user: userWithoutPassword,
      accessToken,
    },
    StatusCodes.CREATED
  );
};

export const login = async function (req: Request, res: Response) {
  const data = req.body;
  throwErrorIfBodyIsEmpty(
    data,
    ["email", "password"],
    "Email and Password required"
  );
  const user = await Admin.findOne({ email: data.email });
  if (!user) return throwUnauthorizedError("Invalid Email or Password");
  if (user.loginAttempts >= 3)
    throwUnprocessableEntityError(
      "Maximum login attempt exceeded. Your account has been locked. Please contact admin @(philipowolabi79@gmail.com) for fixing"
    );
  // Validate the password using the document method (validatePassword)
  const isValidPassword = await user.validatePassword(data.password);
  if (!isValidPassword) {
    user.$inc("loginAttempts", 1);
    user.set("isLoggedIn", false);
    await user.save();
    throwUnauthorizedError("Invalid Email or Password");
  }
  // Generate jwt for valid email and password
  user.set("isLoggedIn", true);
  user.set("loginAttempts", 0);
  await user.save();
  const userWithoutPassword = _.omit(user.toObject(), "password");
  userWithoutPassword.userId = userWithoutPassword._id;
  const { userId, email } = userWithoutPassword;
  const accessToken = user.generateToken({ userId, email });
  return sendSuccessResponse(res, {
    message: "Login successful",
    user: userWithoutPassword,
    accessToken,
  });
};

export const getAdminDetails = async (req: any, res: Response) => {
  const userWithoutPassword = _.omit(req.currentUser.toObject(), "password");
  userWithoutPassword.userId = userWithoutPassword._id;
  return sendSuccessResponse(res, {
    message: "Successful",
    user: userWithoutPassword,
  });
};

export const removeAdminAccount = async (req: Request, res: Response) => {
  throwErrorIfBodyIsEmpty(req.body, undefined, "Please provide req body");
  const { userId, email } = req.body;
  if (!userId && !email)
    throwBadRequestError("PLease provide user id or email");

  let finder: Record<string, any> = {};
  if (userId) {
    finder._id = userId;
  }
  if (email) {
    finder.email = email;
  }

  let user = await Admin.findOneAndDelete(finder).select("-password");

  if (!user) return throwNotFoundError("Admin not found.");
  const userWithoutPassword = _.omit(user.toObject());
  userWithoutPassword.userId = userWithoutPassword._id;
  return sendSuccessResponse(res, {
    message: "Admin account removed successfully.",
    user: userWithoutPassword,
  });
};

export const requestAccountVerificationOTP = async (
  req: any,
  res: Response
) => {
  const { email } = req.currentUser;
  if (req.currentUser.isVerified)
    throwUnprocessableEntityError("Account already verified");
  const user = await Admin.findOne({
    email: { $regex: email, $options: "i" },
  });
  if (!user) return throwUnauthorizedError("Unauthorized User");
  const otpDoc = (await generateOtp({ email }))!;
  const mailOptions = {
    content: {
      otpCode: Number(otpDoc.otpCode),
      email: otpDoc.email,
    },
    template: "verification",
  };
  await sendOtpEmail(mailOptions);
  return sendSuccessResponse(res, {
    message: "A verification code has been sent to your email.",
  });
};

export const verifyAccount = async (req: any, res: Response) => {
  const { email } = req.currentUser;
  if (!email) return throwUnauthorizedError("Unauthorized user");
  const { otp } = req.body;
  if (!otp) return throwBadRequestError("Must provide verification code");
  await verifyOTP({ email, otp });
  await req.currentUser.set("isVerified", true);
  await req.currentUser.save();
  return sendSuccessResponse(res, {
    message: "Verification successful",
    redirectUrl: "/dashboard",
  });
};

export const logout = async (req: any, res: Response) => {
  const { _id: userId, email } = req.currentUser;
  let finder: Record<string, any> = {};

  if (userId) {
    finder._id = userId;
  }
  if (email) {
    finder.email = email;
  }

  let user = await Admin.findOneAndUpdate(
    finder,
    {
      isLoggedIn: false,
      loginAttempts: 0,
    },
    { new: true }
  ).select("-password");

  if (!user) return throwUnauthorizedError("Unauthorized User");
  const userWithoutPassword = _.omit(user.toObject());
  userWithoutPassword.userId = userWithoutPassword._id;
  return sendSuccessResponse(res, {
    message: "Logout successful",
    user: userWithoutPassword,
  });
};
