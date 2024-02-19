import mongoose from "mongoose";

const { model } = mongoose;

const lessonProgressSchema = new mongoose.Schema({
    participantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    achievedMins: {
        type: Number,
        required: true,
        default: 0,
        validate: {
             // Access totalMins from the parent document
            validator: function(value) {
                return value <= this.parent().totalMins;
            },
            message: props => `AchievedMins (${props.value}) should be smaller than totalMins`
        }
    },
    notes: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending',
    }
});

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    totalMins: {
        type: Number,
        required: true,
        default: 0,
    },
    resources: {
        type: [String],
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    lessonProgress: [lessonProgressSchema],
},{
    timestamps:true
});

export default model("Lesson", lessonSchema);
