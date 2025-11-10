import mongoose from 'mongoose';

const CoachesSchema = new mongoose.Schema({
  name: String,
  sport: String,
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'pending' }, // approved/rejected
});

export default mongoose.model('coachesModel', CoachesSchema);
