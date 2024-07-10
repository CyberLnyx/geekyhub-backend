import {
  register,
  getAdminDetails,
  login,
  logout,
  requestAccountVerificationOTP,
  verifyAccount as verifyAdminAccount,
  removeAdminAccount,
} from "../controllers";
import { routerCreator } from "../helpers";
import { validateToken } from "../middlewares";

// Create a new router
const adminRouter = routerCreator();

// Bind routes to controllers
adminRouter.post("/login", login);
adminRouter.post("/register", register);

// Admin middleware
adminRouter.use("/admin", validateToken("admin"));
adminRouter.post("/admin/logout", logout);
adminRouter.get("/admin/get-admin", getAdminDetails);
adminRouter.post("/admin/get-verification-otp", requestAccountVerificationOTP);
adminRouter.post("/admin/verify-account", verifyAdminAccount);
adminRouter.delete("/admin/remove", removeAdminAccount);

export default adminRouter;
