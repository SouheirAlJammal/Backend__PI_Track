import mongoose from "mongoose";

const { Schema, model } = mongoose;

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
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
    status: {
        type: String,
        enum: ['Pending', 'Progress', 'Completed'],
        default: 'Pending'
    },
    resources: {
        type: [String],
    },
    notes: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    planId: {
        type: mongoose.Types.ObjectId,
        required: true
    }


});

export default model("Lesson", lessonSchema);
