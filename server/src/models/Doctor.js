import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  day: { type: Number, min: 0, max: 6, required: true },
  start: { type: String, required: true },
  end: { type: String, required: true }
}, { _id: false });

const doctorSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true, uppercase: true, trim: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  specialization: { type: String, required: true, trim: true },
  department: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  licenseNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
  consultationFee: { type: Number, min: 0, default: 0 },
  schedule: { type: [scheduleSchema], default: [] },
  active: { type: Boolean, default: true }
}, { timestamps: true });

doctorSchema.index({ firstName: 'text', lastName: 'text', specialization: 'text', department: 'text' });
export default mongoose.model('Doctor', doctorSchema);
