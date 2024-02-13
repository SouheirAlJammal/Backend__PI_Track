import mongoose from "mongoose";

const { model } = mongoose;

const planSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    image:{
        type:String,
    },
    totalMins: {
        type: Number,
        required: true,
        default:0
    },
    achievedMins: {
        type: Number,
        required: true,
        default: 0,
        validate: {
            validator: function(value) {
                return value <= this.totalMins;
            },
            message: props => `AchievedMins (${props.value}) should be smaller than totalMins (${this.totalMins})`
        }
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
   createrId:{
    type:mongoose.Types.ObjectId,
    required:true
   },
   followersId:{
    type:[mongoose.Types.ObjectId]
   },
   editorsId:{
    type:[mongoose.Types.ObjectId]
   },
   lessonsId:{
    type:[mongoose.Types.ObjectId]
   }

});

export default model("Lesson", planSchema);
