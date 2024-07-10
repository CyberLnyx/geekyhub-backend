"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controllers_1 = require("../controllers");
const helpers_1 = require("../helpers");
const middlewares_1 = require("../middlewares");
// Create a new router
const adminRouter = (0, helpers_1.routerCreator)();
// Bind routes to controllers
adminRouter.post("/login", controllers_1.login);
adminRouter.post("/register", controllers_1.register);
// Admin middleware
adminRouter.use("/admin", (0, middlewares_1.validateToken)("admin"));
adminRouter.post("/admin/logout", controllers_1.logout);
adminRouter.get("/admin/get-admin", controllers_1.getAdminDetails);
adminRouter.post("/admin/get-verification-otp", controllers_1.requestAccountVerificationOTP);
adminRouter.post("/admin/verify-account", controllers_1.verifyAccount);
adminRouter.delete("/admin/remove", controllers_1.removeAdminAccount);
exports.default = adminRouter;
