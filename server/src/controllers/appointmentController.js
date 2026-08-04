import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

async function assertReferences(patient, doctor) {
  const [p, d] = await Promise.all([Patient.findById(patient), Doctor.findById(doctor)]);
  if (!p || !p.active) throw new ApiError(400, 'Selected patient is unavailable');
  if (!d || !d.active) throw new ApiError(400, 'Selected doctor is unavailable');
}
async function assertNoConflict({ doctor, startTime, endTime, excludeId }) {
  const conflict = await Appointment.findOne({
    doctor,
    _id: { $ne: excludeId },
    status: { $nin: ['cancelled', 'no-show'] },
    startTime: { $lt: new Date(endTime) },
    endTime: { $gt: new Date(startTime) }
  });
  if (conflict) throw new ApiError(409, 'Doctor already has an overlapping appointment');
}

export const listAppointments = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.doctor) filter.doctor = req.query.doctor;
  if (req.query.patient) filter.patient = req.query.patient;
  if (req.query.from || req.query.to) {
    filter.startTime = {};
    if (req.query.from) filter.startTime.$gte = new Date(req.query.from);
    if (req.query.to) filter.startTime.$lte = new Date(req.query.to);
  }
  if (req.user.role === 'doctor' && req.user.doctor) filter.doctor = req.user.doctor;

  const [items, total] = await Promise.all([
    Appointment.find(filter).populate('patient', 'firstName lastName medicalRecordNumber').populate('doctor', 'firstName lastName specialization').sort({ startTime: 1 }).skip((page - 1) * limit).limit(limit),
    Appointment.countDocuments(filter)
  ]);
  res.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

export const createAppointment = asyncHandler(async (req, res) => {
  const data = req.validated.body;
  await assertReferences(data.patient, data.doctor);
  await assertNoConflict(data);
  const item = await Appointment.create({ ...data, createdBy: req.user._id });
  await item.populate([{ path: 'patient', select: 'firstName lastName medicalRecordNumber' }, { path: 'doctor', select: 'firstName lastName specialization' }]);
  res.status(201).json({ item });
});

export const updateAppointment = asyncHandler(async (req, res) => {
  const current = await Appointment.findById(req.params.id);
  if (!current) throw new ApiError(404, 'Appointment not found');
  const data = { ...current.toObject(), ...req.validated.body };
  await assertReferences(data.patient, data.doctor);
  await assertNoConflict({ ...data, excludeId: current._id });
  Object.assign(current, req.validated.body);
  await current.save();
  await current.populate([{ path: 'patient', select: 'firstName lastName medicalRecordNumber' }, { path: 'doctor', select: 'firstName lastName specialization' }]);
  res.json({ item: current });
});

export const deleteAppointment = asyncHandler(async (req, res) => {
  const item = await Appointment.findByIdAndDelete(req.params.id);
  if (!item) throw new ApiError(404, 'Appointment not found');
  res.status(204).send();
});
