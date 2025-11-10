import mongoose from 'mongoose';

const ConnectDb = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("DB Connected");
        
    } catch (error) {
        console.log("DB Connection Error");
    }
}

export default ConnectDb;