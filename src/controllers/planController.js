import Plan from "../models/planModel.js";

const createPlan = async (req, res) => {
    try {
        const { title, image, totalMins, followersId, editorsId, lessonsId } = req.body;
        let createrId=req.userData.id

        if (!title || !createrId) {
            return res.status(400).json({ message: "Missing required data!" });
        }
        const newPlan = await Plan.create({
            title,
            image,
            totalMins,
            createrId,
            followersId,
            editorsId,
            lessonsId,
        });

        res.status(200).json(newPlan);
    } catch (error) {
        res.status(500).json({ message: "Error while creating plan" });
    }
};

const deletePlan = async (req, res) => {
    try {
        const { id } = req.params;
        
        const plan = await Plan.findByIdAndUpdate(
            id,
            { $set: { isDeleted: true } },
            { new: true }
        );

        if (!plan) {
            return res.status(404).json({ message: "No such plan" });
        }

        res.status(200).json({ message: "Plan soft deleted successfully", data: plan });
    } catch (error) {
        res.status(500).json({ message: "Error while soft deleting the plan" });
    }
};

const updatePlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, image, totalMins, createrId, followersId, editorsId, lessonsId } = req.body;

        const oldPlan = await Plan.findById(id);

        if (!oldPlan) {
            return res.status(404).json({ message: "No such plan" });
        }

        const updatedPlan = await Plan.findByIdAndUpdate(
            id,
            {
                title,
                image,
                totalMins,
                createrId,
                followersId,
                editorsId,
                lessonsId,
            },
            { new: true }
        );

        res.status(200).json({ message: "Plan updated successfully", data: updatedPlan });
    } catch (error) {
        res.status(500).json({ message: "Error while updating plan" });
    }
};

export { createPlan, deletePlan, updatePlan };
