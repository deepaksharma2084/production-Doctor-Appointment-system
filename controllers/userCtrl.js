const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctorModels");
const appointmentModel = require("../models/appointmentModels");

//register callback
const registerController = async (req, res) => {
  console.log("name is", req.body);
  // res.send('message','something went wrong');
  // return false;

  try {
    const exisitingUser = await userModel.findOne({ email: req.body.email });
    if (exisitingUser) {
      return res
        .status(200)
        .send({ message: "User Already Exist", success: false });
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();

    res.status(201).send({ message: "Register Sucessfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};

// login callback
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invlid EMail or Password", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res
      .status(200)
      .send({ message: "Login Success", success: true, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: `Error in Login CTRL ${error.message}`,
      success: false,
    });
  }
};

const authCtrl = async (req, res) => {
  console.log("get user id", req.body.userId);
  // res.status(500).send({message:'hello',success:true});
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.password = undefined;
    //  console.log('user',user);
    if (!user) {
      return res
        .status(200)
        .send({ message: "User not found", success: false });
    } else {
      res.status(200).send({
        success: true,
        data: user,
        // data: {
        //   name: user.name,
        //   email: user.email,
        //   isAdmin: user.isAdmin,
        // },
      });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ message: "auth error", success: false });
  }
};

//apply doctor ctrl
const applyDoctorCtrl = async (req, res) => {
  console.log("request data", req.body);

  try {
    const newDoctor = await doctorModel({ ...req.body, status: "pending" });
    await newDoctor.save();

    const adminUser = await userModel.findOne({ isAdmin: true });
    const notification = adminUser.notification;
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for doctor acccount`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "admin/doctors",
      },
    });

    await userModel.findByIdAndUpdate(adminUser._id, { notification });

    res.status(201).send({
      success: true,
      message: "Doctor account applied successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(200).send({
      success: false,
      error: error,
      message: "Error while applying for Doctor",
    });
  }

  // try {
  //    const newDoctor = await doctorModel({ ...req.body, status: "pending" });
  //    await newDoctor.save();
  //    const adminUser = await userModel.findOne({isAdmin:true})
  //   res.status(201).send({
  //     success: true,
  //     message: "Doctor account applied successfully",
  //   });
  // } catch (error) {
  //   console.log(error);
  //   res.status(500).send({
  //     success: false,
  //     error,
  //     message: "Error while applying for Doctor",
  //   });
  // }
};

//notificaiton ctrl
const getAllNotificaitonController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const notification = user.notification;
    const seenNotification = user.seenNotification;

    seenNotification.push(...notification);
    user.notification = [];
    user.seenNotification = seenNotification;
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "All notification marked as read",
      data: updatedUser,
    });
  } catch (error) {
    res.status(200).send({
      success: false,
      error: error,
      message: "Error while fetch notificaitons",
    });
  }
};

//delete all notificaiton
const deleteAllNotificaitonController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seenNotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;

    res.status(200).send({
      success: true,
      message: "Notification deleted successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(200).send({
      success: false,
      error: error,
      message: "Error while delete notificaitons",
    });
  }
};

const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Doctor list fetched successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      message: "Error while fetching doctors",
      error: error,
    });
  }
};

//Book appintment

const bookeAppointmentController = async (req, res) => {
  try {
    console.log(req.body);
    req.body.status = "pending";
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();

    const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
    user.notification.push({
      type: "new appointment request",
      message: `A new appoinment request from ${req.body.userInfo.name}`,
      onClickPath: "user/appointments",
    });
    await user.save();

    res.status(200).send({
      success: true,
      message: "Appointment booked successfully",
    });
  } catch (error) {
    console.log();
    res.status(500).send({
      success: true,
      message: "Error while booking appintment",
      error: error,
    });
  }
};

//user appoints listing controller

const userAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({
      userId: req.body.userId,
    });

    res.status(200).send({
      success: true,
      data: appointments,
      message: "User appointments fetched successfully",
    });
  } catch (error) {
    console.log();
    res.status(500).send({
      success: true,
      message: "Error while fetched appointments",
      error: error,
    });
  }
};

const getuserinfoController = async (req, res) => {
  try {
    //console.log("hii" + req.body.userId);
    const userInfo = await userModel.find({
      _id: req.body.userId,
    });

    res.status(200).send({
      success: true,
      data: userInfo,
      message: "User info fetched successfully",
    });
  } catch (error) {
    console.log();
    res.status(500).send({
      success: true,
      message: "Error while fetched user info",
      error: error,
    });
  }
};

//update profile contnroller
const updateUserProfileController = async (req, res) => {
  console.log(req.body);
  try {
    const userInfo = await userModel.findOneAndUpdate(
      { _id: req.body.userId },
      req.body
    );

    res.status(201).send({
      success: true,
      message: "Profile updated",
      data: userInfo,
    });
  } catch (error) {
    //console.log(error);
    res.status(500).send({
      success: false,
      error: error,
      message: "Profile update issue",
    });
  }
};

module.exports = {
  registerController,
  loginController,
  authCtrl,
  applyDoctorCtrl,
  getAllNotificaitonController,
  deleteAllNotificaitonController,
  getAllDoctorsController,
  bookeAppointmentController,
  userAppointmentsController,
  getuserinfoController,
  updateUserProfileController,
};
