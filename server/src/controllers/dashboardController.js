import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const dashboard = asyncHandler(async (req, res) => {
  const now = new Date();
  const start = new Date(now); start.setHours(0, 0, 0, 0);
  const end = new Date(now); end.setHours(23, 59, 59, 999);
  const filter = req.user.role === 'doctor' && req.user.doctor ? { doctor: req.user.doctor } : {};
  const [patients, doctors, today, upcoming, statusCounts] = await Promise.all([
    Patient.countDocuments({ active: true }),
    Doctor.countDocuments({ active: true }),
    Appointment.countDocuments({ ...filter, startTime: { $gte: start, $lte: end }, status: { $ne: 'cancelled' } }),
    Appointment.find({ ...filter, startTime: { $gte: now }, status: { $in: ['scheduled', 'checked-in'] } }).populate('patient', 'firstName lastName').populate('doctor', 'firstName lastName specialization').sort({ startTime: 1 }).limit(8),
    Appointment.aggregate([{ $match: filter }, { $group: { _id: '$status', count: { $sum: 1 } } }])
  ]);
  res.json({ metrics: { patients, doctors, today }, upcoming, statusCounts: Object.fromEntries(statusCounts.map(x => [x._id, x.count])) });
});
