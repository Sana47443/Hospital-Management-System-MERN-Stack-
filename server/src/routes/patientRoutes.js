import { Router } from 'express';
import { z } from 'zod';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import * as c from '../controllers/patientController.js';
const router = Router();
const body = z.object({
  medicalRecordNumber: z.string().min(2), firstName: z.string().min(1), lastName: z.string().min(1), dateOfBirth: z.coerce.date(),
  gender: z.enum(['female','male','nonbinary','other','prefer-not-to-say']), phone: z.string().min(5), email: z.string().email().or(z.literal('')).optional(),
  address: z.string().optional(), bloodGroup: z.string().optional(), allergies: z.array(z.string()).optional(),
  emergencyContact: z.object({ name: z.string().optional(), relationship: z.string().optional(), phone: z.string().optional() }).optional(), active: z.boolean().optional()
});
router.use(protect);
router.get('/', c.listPatients); router.get('/:id', c.getPatient);
router.post('/', authorize('admin','receptionist'), validate(z.object({ body, params:z.any(), query:z.any() })), c.createPatient);
router.put('/:id', authorize('admin','receptionist'), validate(z.object({ body: body.partial(), params:z.any(), query:z.any() })), c.updatePatient);
router.delete('/:id', authorize('admin'), c.deletePatient);
export default router;
