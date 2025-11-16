const SubjectModel = require("../models/SubjectCustom");

const createSubject = async (req, res) => {
    try {
        const { type_subject, name_subject, id_level, credits, coefficient } = req.body;
        
        if (!type_subject || !name_subject || !id_level || !credits || !coefficient) {
            return res.status(400).json({
                success: false,
                message: "All fields are required: type_subject, name_subject, id_level, credits, coefficient"
            });
        }

        const subject = await SubjectModel.createSubject(type_subject, name_subject, id_level, credits, coefficient);
        
        res.status(201).json({
            success: true,
            message: "Subject created successfully",
            data: subject
        });
    } catch (error) {
        console.error("Error in createSubject controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getAllSubjectsByLevel = async (req, res) => {
    try {
        const { id_level } = req.params;
        
        if (!id_level) {
            return res.status(400).json({
                success: false,
                message: "Level ID is required"
            });
        }

        const subjects = await SubjectModel.getAllSubjectsByLevel(id_level);
        
        res.status(200).json({
            success: true,
            message: "Subjects retrieved successfully",
            data: subjects
        });
    } catch (error) {
        console.error("Error in getAllSubjectsByLevel controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const updateSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const { type_subject, name_subject, id_level, credits, coefficient } = req.body;
        
        if (!id || !type_subject || !name_subject || !id_level || !credits || !coefficient) {
            return res.status(400).json({
                success: false,
                message: "All fields are required: id, type_subject, name_subject, id_level, credits, coefficient"
            });
        }

        const subject = await SubjectModel.updateSubjectById(id, type_subject, name_subject, id_level, credits, coefficient);
        
        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Subject updated successfully",
            data: subject
        });
    } catch (error) {
        console.error("Error in updateSubject controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const deleteSubject = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Subject ID is required"
            });
        }

        const subject = await SubjectModel.deleteSubjectById(id);
        
        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Subject deleted successfully",
            data: subject
        });
    } catch (error) {
        console.error("Error in deleteSubject controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    createSubject,
    getAllSubjectsByLevel,
    updateSubject,
    deleteSubject
};