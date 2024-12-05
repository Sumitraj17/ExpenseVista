import mongoose from 'mongoose'
import { config } from 'dotenv'
config()
const connectToDB = async()=>{
    try{
        const connect = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connection Successful ${connect}`)
    }
    catch(e){
        console.log(`Error occured:- ${e}`)
    }

}

export default connectToDB