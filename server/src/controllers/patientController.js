import Patient from '../models/Patient.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listPatients = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
  const search = String(req.query.search || '').trim();
  const filter = search ? { $or: [
    { firstName: new RegExp(search, 'i') }, { lastName: new RegExp(search, 'i') },
    { medicalRecordNumber: new RegExp(search, 'i') }, { phone: new RegExp(search, 'i') }
  ] } : {};
  const [items, total] = await Promise.all([
    Patient.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Patient.countDocuments(filter)
  ]);
  res.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

export const getPatient = asyncHandler(async (req, res) => {
  const item = await Patient.findById(req.params.id);
  if (!item) throw new ApiError(404, 'Patient not found');
  res.json({ item });
});

export const createPatient = asyncHandler(async (req, res) => {
  const item = await Patient.create(req.validated.body);
  res.status(201).json({ item });
});

export const updatePatient = asyncHandler(async (req, res) => {
  const item = await Patient.findByIdAndUpdate(req.params.id, req.validated.body, { new: true, runValidators: true });
  if (!item) throw new ApiError(404, 'Patient not found');
  res.json({ item });
});

export const deletePatient = asyncHandler(async (req, res) => {
  const item = await Patient.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
  if (!item) throw new ApiError(404, 'Patient not found');
  res.json({ item });
});
