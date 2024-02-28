import Plan from "../models/planModel.js";
import Lesson from "../models/lessonModel.js";
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
        const { title, description ,participants} = req.body;

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
export { createPlan, editPlan, deletePlan, getAllPlans, getPlanById };
