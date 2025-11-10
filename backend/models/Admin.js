
import mongoose from 'mongoose';
const AdminSchema = new mongoose.Schema({
  email: String,
  password: String, // Hashed
  role: { type: String, default: "admin" },
});
export default mongoose.model('AdminModel', AdminSchema)
