const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

const adminControllers = require("../controllers/adminCtrl");

router.get(
  "/getAllUsers",
  authMiddleware,
  adminControllers.getAlluserController
);
router.get(
  "/getAllDoctor",
  authMiddleware,
  adminControllers.getAllDoctorController
);
router.post(
  "/changeAccountStatus",
  authMiddleware,
  adminControllers.changeAccountController
);

module.exports = router;
