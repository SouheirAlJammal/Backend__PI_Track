import Task from "../models/taskModel.js";

const createTask = async (req, res) => {
    try {
        const { title, description, startDate, endDate, status } = req.body;
        const userId = req.userData.id;
        console.log("hello", userId)
        if (!title || !description || !startDate || !endDate || !userId) {
            return res.status(400).json({ message: "Missing data!" });
        }
        const newTask = await Task.create({
            title, description, startDate, endDate, userId, status
        });

        res.status(200).json(newTask);
    } catch (error) {
        res.status(500).json({ message: "Error while adding task" });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findOneAndDelete({ _id: id });

        if (!task) {
            return res.status(404).json({ message: "No such task" });
        }

        res.status(200).json("Task deleted successfully");
    } catch (error) {
        res.status(500).json({ message: "Error while deleting the task" });
    }
};


const getTasks = async (req, res) => {
    const userId = req.userData.id; 

    try {
        const tasks = await Task.find({ userId: userId });

        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ error: "No tasks found" });
        }

        res.status(200).json({ data: tasks });
    } catch (error) {
        console.error("Error while getting tasks:", error);
        res.status(500).json({ message: "Error while getting tasks" });
    }
};

const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, startDate, endDate, status } = req.body;

        const oldTask = await Task.findById(id);

        if (!oldTask) {
            return res.status(404).json({ message: "No such task" });
        }

        const task = await Task.findByIdAndUpdate(
            { _id: id },
            {
                title, description, startDate, endDate, status
            },
            { new: true }
        );

        return res.status(200).json({ message: "Task updated successfully", data: task });
    } catch (error) {
        return res.status(500).json({ message: "Error while updating details" });
    }
};

const getTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ message: "No such task" });
        }

        res.status(200).json({ data: task, message: 'Success' });
    } catch (error) {
        res.status(500).json({ message: "Error while getting the task" });
    }
};

export { createTask, getTask, getTasks, deleteTask, updateTask };
