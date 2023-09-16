const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const doctorCtrl = require("../controllers/doctorCtrl");

//router onject
const router = express.Router();

//get single doctor info

router.post(
  "/getdoctorinfo",
  authMiddleware,
  doctorCtrl.getDoctorInfoController
);

router.post(
  "/updateProfile",
  authMiddleware,
  doctorCtrl.updateProfileController
);

//post get single doc info
router.post(
  "/getDoctorById",
  authMiddleware,
  doctorCtrl.getDoctorByIdController
);

//get doctor apointments
router.get(
  "/doctor-appointments",
  authMiddleware,
  doctorCtrl.doctorAppointmentsController
);

//post get single doc info
router.post(
  "/update-status",
  authMiddleware,
  doctorCtrl.updateStatusController
);

// router.post("/updateProfile", authMiddleware, (req, res) => {
//   res.send("hiiii Hello, World!");
// });

// router.post("/getdoctorinfo", authMiddleware, (req, res) => {
//     res.send("hi Hello, World!");
//   });

// router.post("/getDoctorById", authMiddleware, (req, res) => {
//   res.send("hi Hello, World!");
// });

module.exports = router;
