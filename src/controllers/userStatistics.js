import Task from "../models/taskModel.js";
import Plan from '../models/planModel.js'
const getTaskStatistics = async (req, res) => {
    try {
        const userId = req.userData.id; 

        const pendingTasksCount = await Task.countDocuments({ userId, status: 'Pending' });
        const inProgressTasksCount = await Task.countDocuments({ userId, status: 'Progress' });
        const completedTasksCount = await Task.countDocuments({ userId, status: 'Completed' });

        res.status(200).json({
            pending: pendingTasksCount,
            inProgress: inProgressTasksCount,
            completed: completedTasksCount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error while getting task statistics" });
    }
};


const getPlansWithProgress = async (req, res) => {
    try {
        const userId = req.userData.id; 

        // Fetch all plans
        const plans = await Plan.find({ "participants.userId": userId }).populate("lessonsId");

        // Calculate progress percentage for each plan
        const plansWithProgress = plans.map((plan) => {
            const totalLessons = plan.lessonsId.length;
            const completedLessons = plan.lessonsId.filter((lesson) =>
                lesson.lessonProgress.some((progress) => progress.participantId.toString() === userId && progress.status === 'Completed')
            ).length;

            const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

            return {
                planId: plan._id,
                title: plan.title,
                progressPercentage,
                totalLessons
            };
        });

        res.status(200).json({ data: plansWithProgress });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error while getting plans with progress" });
    }
};

export { getPlansWithProgress,getTaskStatistics };
