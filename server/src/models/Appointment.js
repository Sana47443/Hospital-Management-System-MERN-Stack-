import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true, index: true },
  startTime: { type: Date, required: true, index: true },
  endTime: { type: Date, required: true },
  reason: { type: String, required: true, trim: true, maxlength: 500 },
  notes: { type: String, trim: true, maxlength: 3000, default: '' },
  status: { type: String, enum: ['scheduled', 'checked-in', 'in-progress', 'completed', 'cancelled', 'no-show'], default: 'scheduled', index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cancellationReason: { type: String, trim: true, default: '' }
}, { timestamps: true });

appointmentSchema.pre('validate', function(next) {
  if (this.endTime <= this.startTime) return next(new Error('Appointment end time must be after start time'));
  next();
});

export default mongoose.model('Appointment', appointmentSchema);
