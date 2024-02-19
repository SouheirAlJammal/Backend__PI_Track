import mongoose from "mongoose";

const { model } = mongoose;

const participantSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    role: {
        type: String,
        enum: ['creator', 'editor', 'follower'],
        required: true,
    },
    achievedTotalMins: {
        type: Number,
        default: 0,
    }
});


const planSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    image: String,
    createrId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    totalMins: {
        type: Number,
        default: 0,
    },
    participants: [participantSchema],
    lessonsId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
    }],
    isDeleted: {
        type: Boolean,
        default: false,
    },
    invitations: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        role: {
            type: String,
            enum: ['editor', 'follower'],
            required: true,
        },
        isAccepted: {
            type: Boolean,
            default: false
        }
    }
}, {
    timestamps: true,
});
export default model("Plan", planSchema);
