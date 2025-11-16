const GroupModel = require("../models/GroupCustom");

const createGroup = async (req, res) => {
    try {
        const { code_groupe, level_id } = req.body;

        if (!code_groupe || !level_id) {
            console.log(code_group, level_id);
            return res.status(400).json({
                success: false,
                message: "Group code and level ID are required"
            });
        }

        const group = await GroupModel.createGroup(code_groupe, level_id);
        
        res.status(201).json({
            success: true,
            message: "Group created successfully",
            data: group
        });
    } catch (error) {
        console.error("Error in createGroup controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getAllGroupsByLevel = async (req, res) => {
    try {
        const { id_level } = req.params;
        
        if (!id_level) {
            return res.status(400).json({
                success: false,
                message: "Level ID is required"
            });
        }

        const groups = await GroupModel.getAllGroupsByLevel(id_level);
        
        res.status(200).json({
            success: true,
            message: "Groups retrieved successfully",
            data: groups
        });
    } catch (error) {
        console.error("Error in getAllGroupsByLevel controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const updateGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const { code_groupe } = req.body;
        console.log(id , code_groupe);
        
        if (!id || !code_groupe) {
            return res.status(400).json({
                success: false,
                message: "Group ID and code are required"
            });
        }

        const group = await GroupModel.updateGroupById(id, code_groupe);
        
        if (!group) {
            return res.status(404).json({
                success: false,
                message: "Group not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Group updated successfully",
            data: group
        });
    } catch (error) {
        console.error("Error in updateGroup controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const deleteGroup = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Group ID is required"
            });
        }

        const group = await GroupModel.deleteGroupById(id);
        
        if (!group) {
            return res.status(404).json({
                success: false,
                message: "Group not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Group deleted successfully",
            data: group
        });
    } catch (error) {
        console.error("Error in deleteGroup controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    createGroup,
    getAllGroupsByLevel,
    updateGroup,
    deleteGroup
};