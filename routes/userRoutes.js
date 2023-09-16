const express = require("express");
// const {
//   loginController,
//   registerController,
// } = require("../controllers/userCtrl");

const userController = require("../controllers/userCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

//router onject
const router = express.Router();

//routes
//LOGIN || POST
//router.post("/login", userController.loginController);

//REGISTER || POST
router.post("/getUserData_", authMiddleware, (req, res) => {
  // Route logic
  res.send("Hello, World!");
});

router.post("/register", userController.registerController);
router.post("/login", userController.loginController);
router.post("/getUserData", authMiddleware, userController.authCtrl);

//apply doctor || POST
router.post("/apply-doctor", authMiddleware, userController.applyDoctorCtrl);

//notification || POST
router.post(
  "/get-all-notification",
  authMiddleware,
  userController.getAllNotificaitonController
);
//delete all  || POST
router.post(
  "/delete-all-notification",
  authMiddleware,
  userController.deleteAllNotificaitonController
);

router.get(
  "/getAllDoctors",
  authMiddleware,
  userController.getAllDoctorsController
);

router.post(
  "/book-appointment",
  authMiddleware,
  userController.bookeAppointmentController
);

//appointments list get

router.get(
  "/user-appointments",
  authMiddleware,
  userController.userAppointmentsController
);

router.get(
  "/getuserinfo",
  authMiddleware,
  userController.getuserinfoController
);

router.post(
  "/updateUserProfile",
  authMiddleware,
  userController.updateUserProfileController
);

module.exports = router;
