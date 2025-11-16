const LevelModel = require("../models/LevelCustom");

const createLevel = async (req, res) => {
    try {
        const { num_level, speciality_id } = req.body;
        
        if (!num_level || !speciality_id) {
            return res.status(400).json({
                success: false,
                message: "Level number and speciality ID are required"
            });
        }

        const level = await LevelModel.createLevel(num_level, speciality_id);
        
        res.status(201).json({
            success: true,
            message: "Level created successfully",
            data: level
        });
    } catch (error) {
        console.error("Error in createLevel controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getLevelsBySpeciality = async (req, res) => {
    try {
        const { speciality_id } = req.params;
        
        if (!speciality_id) {
            return res.status(400).json({
                success: false,
                message: "Speciality ID is required"
            });
        }

        const levels = await LevelModel.getLevelsBySpeciality(speciality_id);
        
        res.status(200).json({
            success: true,
            message: "Levels retrieved successfully",
            data: levels
        });
    } catch (error) {
        console.error("Error in getLevelsBySpeciality controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const deleteLevel = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Level ID is required"
            });
        }

        const level = await LevelModel.deleteLevelById(id);
        
        if (!level) {
            return res.status(404).json({
                success: false,
                message: "Level not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Level deleted successfully",
            data: level
        });
    } catch (error) {
        console.error("Error in deleteLevel controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    createLevel,
    getLevelsBySpeciality,
    deleteLevel
};