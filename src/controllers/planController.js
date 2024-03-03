import Plan from "../models/planModel.js";
import Lesson from "../models/lessonModel.js";
import { sendInvitationEmail } from "../utils/sendingMails.js";
import  validator  from "validator";

// Function to check if a user is an editor in the plan
const isEditorInPlan = (userId, plan) => {
    return plan.participants.some(participant => participant.userId.toString() === userId && participant.role === 'editor');
};


// Create a plan
const createPlan = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: "Missing required data!" });
        }

        const createrId = req.userData.id;
        const imagePath = req.file ? req.file.location : null;
        console.log(imagePath)

        const creatorParticipant = {
            userId: createrId,
            role: 'creator',
        };


        const newPlan = await Plan.create({
            title,
            description,
            image: imagePath,
            createrId,
            participants: [creatorParticipant],
        });


        res.status(201).json(newPlan);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error while creating plan" });
    }
};


// Update plan details (only for the creator or editor of the plan)
const editPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, participants } = req.body;

        const plan = await Plan.findById(id);

        if (!plan) {
            return res.status(404).json({ message: "No such plan" });
        }

        // Check if the user is the creator or editor of the plan
        const isCreatorOrEditor = plan.createrId.toString() === req.userData.id || isEditorInPlan(req.userData.id, plan);

        if (!isCreatorOrEditor) {
            return res.status(403).json({ message: "User is not authorized to edit this plan" });
        }

        // Update plan details
        plan.title = title || plan.title;
        plan.description = description || plan.description;
        plan.participants = participants || plan.participants;

        if (req.file) {
            plan.image = req.file.location;
        }

        // Save the updated plan
        await plan.save();

        // Check for new participants and create initial lesson progress entries
        const existingParticipantIds = plan.participants.map(participant => participant.userId.toString());
        const newParticipants = participants.filter(participant => !existingParticipantIds.includes(participant.userId.toString()));

        // Loop through all lessons and create lesson progress entries for new participant
        await Promise.all(plan.lessonsId.map(async lessonId => {
            const lesson = await Lesson.findById(lessonId);
            if (lesson) {
                newParticipants.forEach(async newParticipant => {
                    lesson.lessonProgress.push({
                        participantId: newParticipant.userId,
                        achievedMins: 0,
                        notes: "",
                        status: "Pending",
                    });
                });
                await lesson.save();
            }
        }));

        res.status(200).json({ message: "Plan details updated successfully", data: plan });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error while updating plan details" });
    }
};


// Soft delete a plan (only for the creator of the plan)
const deletePlan = async (req, res) => {
    try {
        const { id } = req.params;

        const plan = await Plan.findById(id);

        if (!plan) {
            return res.status(404).json({ message: "No such plan" });
        }

        // Check if the user is the creator of the plan
        const isCreator = plan.createrId.toString() === req.user.id;

        if (!isCreator) {
            return res.status(403).json({ message: "User is not authorized to delete this plan" });
        }

        // Soft delete the plan
        plan.isDeleted = true;

        // Soft delete associated lessons
        const lessons = await Lesson.find({ planId: plan._id });
        lessons.forEach(async (lesson) => {
            lesson.isDeleted = true;
            await lesson.save();
        });

        // Save the updated plan and lessons
        await plan.save();

        res.status(200).json({ message: "Plan soft deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error while soft deleting plan" });
    }
};

// Fetch all plans for a user (creator, editor, and follower)
const getAllPlans = async (req, res) => {
    try {
        const userId = req.userData.id;

        // Find plans where the user is a participant
        const plans = await Plan.find({
            'participants.userId': userId,
            isDeleted: false,
        });

        res.status(200).json({ data: plans });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error while getting plans for the user" });
    }
};
const getPlanById = async (req, res) => {
    try {
        const { id } = req.params;

        const plan = await Plan.findById(id);

        if (!plan) {
            return res.status(404).json({ message: "No such plan" });
        }

        res.status(200).json({ data: plan });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error while getting plan details" });
    }
};

const InviteParticipant = async (req, res) => {
    try {
        const { email, role,planId } = req.body;

        // Find the plan
        const plan = await Plan.findById(planId);

        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        // Check if the user making the request is the creator of the plan
        if (plan.createrId.toString() !== req.userData.id) {
            return res.status(403).json({ message: 'Unauthorized to invite users to this plan' });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Create a new invitation
        const newInvitation = {
            email,
            role,
            isAccepted: false,
        };

        // Add the new invitation to the plan
        plan.invitations.push(newInvitation);

        // Save the updated plan
        await plan.save();
        const invitationId = plan.invitations[plan.invitations.length - 1]._id;

        // Send invitation email with the invitation ID
        await sendInvitationEmail(email, `${process.env.FRONTEND_ORIGIN}/invitation/accept/${planId}/${invitationId}`);

        res.status(200).json({ message: 'Invitation sent successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const acceptInvitation = async (req, res) => {
    try {
        const { planId, invitationId } = req.body;
        // Find the plan with the provided planId
        const plan = await Plan.findById(planId);

        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        // Find the invitation by ID
        const invitationIndex = plan.invitations.findIndex(invitation => invitation._id.toString() === invitationId);

        if (invitationIndex === -1) {
            return res.status(404).json({ message: 'Invitation not found' });
        }

        const invitation = plan.invitations[invitationIndex];

        // Update the plan participants and remove the invitation
        plan.participants.push({ userId: '65e18c17294a2bc81aeca523', role: invitation.role });
        plan.invitations.splice(invitationIndex, 1);

        // Save the updated plan
        const updatedPlan = await plan.save();

        res.status(200).json({ message: 'Invitation accepted successfully', data: updatedPlan });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


///get followers Infooo
const getFollowersInfo = async (req, res) => {
    try {
        const { planId } = req.params;
        const plan = await Plan.findById(planId).populate({
            path: 'participants.userId',
            model: 'User',
            select: 'username email image',
        });

        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        res.status(200).json({ participants: plan.participants });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


export { createPlan, editPlan, deletePlan, getAllPlans, getPlanById,InviteParticipant,acceptInvitation,getFollowersInfo };
