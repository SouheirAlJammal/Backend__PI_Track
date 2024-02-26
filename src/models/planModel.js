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

const invitationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: function () {
            // Only required if the invitations array is present
            return this.parent().invitations && this.parent().invitations.length > 0;
        },
    },
    role: {
        type: String,
        enum: ['editor', 'follower'],
        required: function () {
            // Only required if the invitations array is present
            return this.parent().invitations && this.parent().invitations.length > 0;
        },
    },
    isAccepted: {
        type: Boolean,
        default: false
    }
}, { _id: false });

const planSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
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
    invitations: [invitationSchema], 
}, {
    timestamps: true,
});

export default model("Plan", planSchema);
