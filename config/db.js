const mongoose = require('mongoose')
const colors = require('colors')

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`Mongodb connected ${process.env.MONGO_URL}`);
    }catch(error){
        console.log(`Mongodb server issue ${error}`);
    }

}

module.exports = connectDB;