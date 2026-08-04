import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['admin', 'receptionist', 'doctor'], default: 'receptionist' },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', default: null },
  active: { type: Boolean, default: true }
}, { timestamps: true });

userSchema.methods.setPassword = async function(password) {
  this.passwordHash = await bcrypt.hash(password, 12);
};
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.passwordHash);
};
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

export default mongoose.model('User', userSchema);
