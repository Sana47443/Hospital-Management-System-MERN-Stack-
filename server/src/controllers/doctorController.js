import Doctor from '../models/Doctor.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listDoctors = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
  const search = String(req.query.search || '').trim();
  const filter = search ? { $or: [
    { firstName: new RegExp(search, 'i') }, { lastName: new RegExp(search, 'i') },
    { specialization: new RegExp(search, 'i') }, { department: new RegExp(search, 'i') }
  ] } : {};
  const [items, total] = await Promise.all([
    Doctor.find(filter).sort({ lastName: 1 }).skip((page - 1) * limit).limit(limit),
    Doctor.countDocuments(filter)
  ]);
  res.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});
export const getDoctor = asyncHandler(async (req, res) => {
  const item = await Doctor.findById(req.params.id);
  if (!item) throw new ApiError(404, 'Doctor not found');
  res.json({ item });
});
export const createDoctor = asyncHandler(async (req, res) => res.status(201).json({ item: await Doctor.create(req.validated.body) }));
export const updateDoctor = asyncHandler(async (req, res) => {
  const item = await Doctor.findByIdAndUpdate(req.params.id, req.validated.body, { new: true, runValidators: true });
  if (!item) throw new ApiError(404, 'Doctor not found');
  res.json({ item });
});
export const deleteDoctor = asyncHandler(async (req, res) => {
  const item = await Doctor.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
  if (!item) throw new ApiError(404, 'Doctor not found');
  res.json({ item });
});
