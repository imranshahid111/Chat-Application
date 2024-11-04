import mongoose from "mongoose";
const connectDB = async ()=> {
    try{
            const con = await mongoose.connect(process.env.Mongo_URL)
            console.log(`Connected to  Mongo DB ${con.connection.host}`)
    }
    catch (error){
        console.log(`Error in Mongodb ${error}`)
    }
};

export default connectDB;