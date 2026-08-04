import 'dotenv/config';
import { connectDB } from '../src/config/db.js';
import User from '../src/models/User.js';
import Doctor from '../src/models/Doctor.js';
import Patient from '../src/models/Patient.js';
import Appointment from '../src/models/Appointment.js';

await connectDB();
await Promise.all([Appointment.deleteMany({}), User.deleteMany({}), Doctor.deleteMany({}), Patient.deleteMany({})]);
const doctors=await Doctor.create([
  {employeeId:'DOC-1001',firstName:'Maya',lastName:'Chen',specialization:'Cardiology',department:'Cardiology',phone:'408-555-0101',email:'maya.chen@hospital.local',licenseNumber:'CA-MC-1001',consultationFee:220},
  {employeeId:'DOC-1002',firstName:'Daniel',lastName:'Rivera',specialization:'Pediatrics',department:'Pediatrics',phone:'408-555-0102',email:'daniel.rivera@hospital.local',licenseNumber:'CA-DR-1002',consultationFee:175}
]);
const patients=await Patient.create([
  {medicalRecordNumber:'MRN-10001',firstName:'Ava',lastName:'Patel',dateOfBirth:'1992-03-14',gender:'female',phone:'408-555-1001',email:'ava@example.com',bloodGroup:'O+'},
  {medicalRecordNumber:'MRN-10002',firstName:'Noah',lastName:'Kim',dateOfBirth:'1986-11-02',gender:'male',phone:'408-555-1002',email:'noah@example.com',bloodGroup:'A-'}
]);
async function createUser(data,password){const u=new User(data);await u.setPassword(password);return u.save();}
const admin=await createUser({name:'System Admin',email:'admin@hospital.local',role:'admin'},'Admin123!');
await createUser({name:'Front Desk',email:'reception@hospital.local',role:'receptionist'},'Reception123!');
await createUser({name:'Dr. Maya Chen',email:'doctor@hospital.local',role:'doctor',doctor:doctors[0]._id},'Doctor123!');
const now=new Date(); now.setDate(now.getDate()+1); now.setHours(10,0,0,0); const end=new Date(now); end.setMinutes(end.getMinutes()+30);
await Appointment.create({patient:patients[0]._id,doctor:doctors[0]._id,startTime:now,endTime:end,reason:'Routine cardiology follow-up',createdBy:admin._id});
console.log('Seed completed'); process.exit(0);
