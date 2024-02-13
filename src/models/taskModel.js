import mongoose from "mongoose";

const { Schema, model } = mongoose;

const taskSchema = new mongoose.Schema({
 title:{
    type:String,
    required:true
 },
 description:{
    type:String,
    required:true
 },
 startDate:{
    type:Date,
    required:true
 },
 endDate:{
    type:Date,
    required:true
 },
 status:{
    type:String,
    enum:['Pending','Progress','Completed'],
    default:'Pending'
 },
 userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required:true
 }


});

export default model("Task", taskSchema);
