import Lesson from "../models/lessonModel.js";
import Plan from "../models/planModel.js";

// Function to check if a user is an editor in the plan
const isEditorInPlan = (userId, plan) => {
    return plan.participants.some(participant => participant.userId.toString() === userId && participant.role === 'editor');
};

// Function to check if a user is a participant in the plan
const isParticipantInPlan = (userId, plan) => {
    return plan.participants.some(participant => participant.userId.toString() === userId);
};


//create lesson
const createLesson = async (req, res) => {
    try {
        const { title, description, totalMins, resources, planId } = req.body;

        if (!title || !description || !totalMins || !planId) {
            return res.status(400).json({ message: "Missing required data!" });
        }

        const plan = await Plan.findById(planId);

        if (!plan) {
            return res.status(404).json({ message: "No such plan" });
        }

        // Check if the user is a creator or editor of the plan
        const isCreatorOrEditor = plan.createrId.toString() === req.userData.id || isEditorInPlan(req.userData.id, plan);

        if (!isCreatorOrEditor) {
            return res.status(403).json({ message: "User is not authorized to create a lesson for this plan" });
        }

        const newLesson = await Lesson.create({
            title,
            description,
            totalMins,
            resources,
            planId,
        });

        // Add the lesson ID to lessonsId array in the plan
        plan.lessonsId.push(newLesson._id);
        // Update totalMins in the plan
        plan.totalMins += totalMins;


        // Create lesson progress entries for all participants in the plan
        await Promise.all(
            plan.participants.map(async participant => {
                // Create a lesson progress entry for each participant
                const lessonProgressEntry = {
                    participantId: participant.userId,
                    achievedMins: 0,
                    notes: '',
                    status: 'Pending',
                };
                // Push the lesson progress entry to the newLesson.lessonProgress array
                newLesson.lessonProgress.push(lessonProgressEntry);
            })
        );
        await newLesson.save();
        await plan.save();

        res.status(201).json(newLesson);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error while creating lesson" });
    }
};


// Update lesson details (only for creators and editors of the plan)
const editLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, totalMins, resources } = req.body;

        const lesson = await Lesson.findById(id);

        if (!lesson) {
            return res.status(404).json({ message: "No such lesson" });
        }

        const plan = await Plan.findById(lesson.planId);

        if (!plan) {
            return res.status(404).json({ message: "No such plan" });
        }

        // Check if the user is a creator or editor of the plan
        const isCreatorOrEditor = plan.createrId.toString() === req.userData.id || isEditorInPlan(req.userData.id, plan);

        if (!isCreatorOrEditor) {
            return res.status(403).json({ message: "User is not authorized to edit this lesson" });
        }

        // Calculate the difference in totalMins if it's modified
        const totalMinsDifference = totalMins - lesson.totalMins;

        // Update lesson details
        lesson.title = title || lesson.title;
        lesson.description = description || lesson.description;
        lesson.totalMins = totalMins || lesson.totalMins;
        lesson.resources = resources || lesson.resources;

        await lesson.save();

        // Update totalMins in the plan
        plan.totalMins += totalMinsDifference;
        await plan.save();

        res.status(200).json({ message: "Lesson details updated successfully", data: lesson });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error while updating lesson details" });
    }
};


// Soft delete a lesson (only for creators and editors of the plan)
const deleteLesson = async (req, res) => {
    try {
        const { id } = req.params;

        const lesson = await Lesson.findById(id);

        if (!lesson) {
            return res.status(404).json({ message: "No such lesson" });
        }

        const plan = await Plan.findById(lesson.planId);

        if (!plan) {
            return res.status(404).json({ message: "No such plan" });
        }

        // Check if the user is a creator or editor of the plan
        const isCreatorOrEditor = plan.createrId.toString() === req.userData.id || isEditorInPlan(req.userData.id, plan);

        if (!isCreatorOrEditor) {
            return res.status(403).json({ message: "User is not authorized to delete this lesson" });
        }

        // Soft delete the lesson
        lesson.isDeleted = true;

        // Update totalMins in the plan
        plan.totalMins -= lesson.totalMins;
        await plan.save();

        await lesson.save();

        res.status(200).json({ message: "Lesson soft deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error while soft deleting lesson" });
    }
};

// Update lesson progress (accessible by all plan participants)

const updateLessonProgress = async (req, res) => {
    try {
        const { lessonId, achievedMins, notes } = req.body;

        const lesson = await Lesson.findById(lessonId);

        if (!lesson) {
            return res.status(404).json({ message: "No such lesson" });
        }

        const plan = await Plan.findById(lesson.planId);
        console.log('plamnIDddd', lesson.planId)
        if (!plan) {
            return res.status(404).json({ message: "No such plan" });
        }

        // Check if the user is a participant in the plan
        const isParticipant = isParticipantInPlan(req.userData.id, plan);
        console.log(isParticipant)
        if (!isParticipant) {
            return res.status(403).json({ message: "User is not a participant in this plan" });
        }

        // Update lesson progress for the logged-in user
        const lessonProgressIndex = lesson.lessonProgress.findIndex(progress => progress.participantId.toString() === req.userData.id);
        console.log(lessonProgressIndex);
        if (lessonProgressIndex !== -1) {
            const lessonProgress = lesson.lessonProgress[lessonProgressIndex];
            lessonProgress.achievedMins = Math.min(achievedMins, lesson.totalMins); // Ensure achievedMins doesn't exceed totalMins
            lessonProgress.notes = notes;

            // Automatically determine the status based on achievedMins and totalMins
            if (lessonProgress.achievedMins >= lesson.totalMins) {
                lessonProgress.status = "Completed";
            } else if (lessonProgress.achievedMins > 0) {
                lessonProgress.status = "In Progress";
            } else {
                lessonProgress.status = "Pending";
            }

            await lesson.save();
            // Update the participant's achievedTotalMins in the plan
            const participantIndex = plan.participants.findIndex(participant => participant.userId.toString() === req.userData.id);

            if (participantIndex !== -1) {
                const participant = plan.participants[participantIndex];
                participant.achievedTotalMins += achievedMins;
                await plan.save();
            }

            res.status(200).json({ message: "Lesson progress updated successfully", data: lesson });
        } else {
            return res.status(403).json({ message: "User is not authorized to edit progress for this lesson" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error while updating lesson progress" });
    }
};


// Get lessons for a specific participant in a specific plan
const getLessonsForParticipant = async (req, res) => {
    try {
        const { planId } = req.params;
        const userId = req.userData.id;

        // Find the plan with lessonsId
        const plan = await Plan.findById(planId).populate('lessonsId');

        if (!plan) {
            return res.status(404).json({ message: "No such plan" });
        }

        // Check if the user is a participant in the plan
        const isParticipant = plan.participants.some(participant => participant.userId.toString() === userId);

        if (!isParticipant) {
            return res.status(403).json({ message: "User is not a participant in this plan" });
        }

        // Fetch lessons along with progress for the specified participant in the plan
        const lessons = await Lesson.find({
            _id: { $in: plan.lessonsId.map(lesson => lesson._id) } // Use lessonsId array from plan
        }).populate({
            path: 'lessonProgress',
            match: { participantId: userId } // Only populate progress for the specified participant
        });

        res.status(200).json({ data: lessons });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error while getting lessons for the participant in the plan" });
    }
};

// Get a lesson by ID for a specific participant in a specific plan
const getLessonByIdForParticipant = async (req, res) => {
    try {
        const { planId, lessonId } = req.params;
        const userId = req.userData.id;

        // Find the plan with lessonsId
        const plan = await Plan.findById(planId).populate('lessonsId');

        if (!plan) {
            return res.status(404).json({ message: "No such plan" });
        }

        // Check if the user is a participant in the plan
        const isParticipant = plan.participants.some(participant => participant.userId.toString() === userId);

        if (!isParticipant) {
            return res.status(403).json({ message: "User is not a participant in this plan" });
        }

        // Fetch the lesson by ID for the specified participant in the plan
        const lesson = await Lesson.findOne({
            _id: lessonId,
            planId: planId
        }).populate({
            path: 'lessonProgress',
            match: { participantId: userId } // Only populate progress for the specified participant
        });

        if (!lesson) {
            return res.status(404).json({ message: "No such lesson in the specified plan" });
        }

        res.status(200).json({ data: lesson });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error while getting the lesson for the participant in the plan" });
    }
};


export {
    createLesson,
    editLesson,
    deleteLesson,
    updateLessonProgress,
    getLessonsForParticipant,
    getLessonByIdForParticipant
};
