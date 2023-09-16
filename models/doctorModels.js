const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const doctorSchema = new Schema(
  {
    userId: {
      type: String,
    },
    firstName: {
      type: String,
      required: [true, "First name id required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name id required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    website: {
      type: String,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    specialization: {
      type: String,
      required: [true, "Specializataion is required"],
    },
    experience: {
      type: String,
      required: [true, "Experience is required"],
    },
    feesPerConsultation: {
      type: Number,
      required: [true, "Fee is required"],
    },
    status: {
      type: String,
      default: "pending",
    },
    timings: {
      type: String,
      required: [true, "Work time is required"],
    },
  },
  { timestamps: true }
);
const doctorModel = mongoose.model("doctor", doctorSchema);

module.exports = doctorModel;
