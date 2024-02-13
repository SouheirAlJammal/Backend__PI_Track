import Lesson from "../models/lessonModel.js";

const createLesson = async (req, res) => {
    try {
        const { title, description, totalMins, achievedMins, planId, resources, notes } = req.body;

        if (!title || !description || !totalMins || !achievedMins || !planId) {
            return res.status(400).json({ message: "Missing data!" });
        }

        if (achievedMins > totalMins) {
            return res.status(400).json({ message: "Achieved minutes cannot be greater than total minutes!" });
        }

        const newLesson = await Lesson.create({
            title, description, totalMins, achievedMins, planId, resources, notes
        });

        res.status(200).json({ data: newLesson });
    } catch (error) {
        res.status(500).json({ message: "Error while adding lesson" });
    }
};

const deleteLesson = async (req, res) => {
    try {
        const { id } = req.params;
        
        const lesson = await Lesson.findByIdAndUpdate(
            id,
            { $set: { isDeleted: true } },
            { new: true }
        );

        if (!lesson) {
            return res.status(404).json({ message: "No such lesson" });
        }

        res.status(200).json({ message: "Lesson soft deleted successfully", data: lesson });
    } catch (error) {
        res.status(500).json({ message: "Error while soft deleting the lesson" });
    }
};

const getLessons = async (req, res) => {
    try {
        const lessons = await Lesson.find();

        if (!lessons || lessons.length === 0) {
            return res.status(404).json({ error: "No lessons found" });
        }

        res.status(200).json({ data: lessons });
    } catch (error) {
        res.status(500).json({ message: "Error while getting lessons" });
    }
};

const editLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, totalMins, achievedMins, resources, notes } = req.body;

        if (achievedMins > totalMins) {
            return res.status(400).json({ message: "Achieved minutes cannot be greater than total minutes!" });
        }

        let status = (achievedMins === totalMins) ? 'Completed' : (achievedMins > 0) ? 'Progress' : '';

        const oldLesson = await Lesson.findById(id);

        if (!oldLesson) {
            return res.status(404).json({ message: "No such lesson" });
        }

        const lesson = await Lesson.findByIdAndUpdate(
            { _id: id },
            {
                title, description, totalMins, achievedMins, resources, notes, status
            },
            { new: true }
        );

        return res.status(200).json({ message: "Lesson updated successfully", data: lesson });
    } catch (error) {
        return res.status(500).json({ message: "Error while updating details" });
    }
};

const getLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const lesson = await Lesson.findById(id);

        if (!lesson) {
            return res.status(404).json({ message: "No such lesson" });
        }

        res.status(200).json({ data: lesson, message: 'Success' });
    } catch (error) {
        res.status(500).json({ message: "Error while getting the lesson" });
    }
};

export { createLesson, getLesson, getLessons, deleteLesson, editLesson };
