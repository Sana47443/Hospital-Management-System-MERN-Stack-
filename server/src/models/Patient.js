import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  medicalRecordNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['female', 'male', 'nonbinary', 'other', 'prefer-not-to-say'], required: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, lowercase: true, trim: true, default: '' },
  address: { type: String, trim: true, default: '' },
  bloodGroup: { type: String, trim: true, default: '' },
  allergies: [{ type: String, trim: true }],
  emergencyContact: {
    name: { type: String, trim: true, default: '' },
    relationship: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' }
  },
  active: { type: Boolean, default: true }
}, { timestamps: true });

patientSchema.index({ firstName: 'text', lastName: 'text', medicalRecordNumber: 'text' });
export default mongoose.model('Patient', patientSchema);
