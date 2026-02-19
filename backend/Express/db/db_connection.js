
const mongoose = require('mongoose');

const connectDb = async ()=>{
    try{
await mongoose.connect("mongodb+srv://Rohan:shree02@cluster0.dwrjyao.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
   
console.log("Database connected Successfully..");
    }catch(err){
        console.log("Error while connecting to database", err);
    }
}

module.exports = connectDb;