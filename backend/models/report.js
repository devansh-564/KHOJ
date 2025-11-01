import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Found", "Lost"],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: String,
  state: String,
  district: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

const Report = mongoose.model("Report", reportSchema);
export default Report;
