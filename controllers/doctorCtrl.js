const appointmentModel = require("../models/appointmentModels");
const doctorModel = require("../models/doctorModels");
const userModel = require("../models/userModels");
const getDoctorInfoController = async (req, res) => {
  //console.log(req.body);
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "doctor data fetched success",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in fetching doctor details",
    });
  }
};

//update profile contnroller
const updateProfileController = async (req, res) => {
  console.log("test");
  try {
    const doctor = await doctorModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );

    res.status(201).send({
      success: true,
      message: "Doctor profile updated",
      data: doctor,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      error: error,
      message: "Doctor profile update issue",
    });
  }
};

//get single doctor info
const getDoctorByIdController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
    //console.log(doctor);
    res.status(200).send({
      success: true,
      data: doctor,
      message: "single doctor info fetched",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error: error,
      message: "Error in single doctor info",
    });
  }
};

//get doctor appointments
const doctorAppointmentsController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    const appoinments = await appointmentModel.find({
      doctorId: doctor._id,
    });
    res.status(200).send({
      success: true,
      data: appoinments,
      message: "Doctor appointments fetched successfully",
    });
  } catch (error) {
    console.log();
    res.status(500).send({
      success: false,
      error: error,
      message: "Error in doctor appointments",
    });
  }
};

//doctor update status
const updateStatusController = async (req, res) => {
  try {
    const { appointmentsId, status } = req.body;

    console.log(appointmentsId);
    console.log(status);

    const appoinment = await appointmentModel.findByIdAndUpdate(
      appointmentsId,
      { status }
    );
    const user = await userModel.findOne({ _id: appoinment.userId });
    user.notification.push({
      type: "status-updated",
      message: "Your appointments has been updated",
      onClickPath: "/doctor-appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointments status updated",
    });
  } catch (error) {
    console.log();
    res.status(500).send({
      success: false,
      error: error,
      message: "Error in status update",
    });
  }
};

module.exports = {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentsController,
  updateStatusController,
};
