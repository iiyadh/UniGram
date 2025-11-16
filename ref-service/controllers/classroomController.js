const ClassroomModel = require("../models/ClassroomCustom");

const createClassroom = async (req, res) => {
    try {
        const { code_classroom, capacity, type_classroom, id_departement } = req.body;
        
        if (!code_classroom || !capacity || !type_classroom || !id_departement) {
            return res.status(400).json({
                success: false,
                message: "All fields are required: code_classroom, capacity, type_classroom, id_departement"
            });
        }

        const classroom = await ClassroomModel.createClassroom(code_classroom, capacity, type_classroom, id_departement);
        
        res.status(201).json({
            success: true,
            message: "Classroom created successfully",
            data: classroom
        });
    } catch (error) {
        console.error("Error in createClassroom controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getAllClassroomsByDep = async (req, res) => {
    try {
        const { id_departement } = req.params;
        
        if (!id_departement) {
            return res.status(400).json({
                success: false,
                message: "Department ID is required"
            });
        }

        const classrooms = await ClassroomModel.getAllClassroomsByDep(id_departement);
        
        res.status(200).json({
            success: true,
            message: "Classrooms retrieved successfully",
            data: classrooms
        });
    } catch (error) {
        console.error("Error in getAllClassroomsByDep controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const updateClassroom = async (req, res) => {
    try {
        const { id } = req.params;
        const { code_classroom, capacity, type_classroom, id_departement } = req.body;
        
        if (!id || !code_classroom || !capacity || !type_classroom || !id_departement) {
            return res.status(400).json({
                success: false,
                message: "All fields are required: id, code_classroom, capacity, type_classroom, id_departement"
            });
        }

        const classroom = await ClassroomModel.updateClassroomById(id, code_classroom, capacity, type_classroom, id_departement);
        
        if (!classroom) {
            return res.status(404).json({
                success: false,
                message: "Classroom not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Classroom updated successfully",
            data: classroom
        });
    } catch (error) {
        console.error("Error in updateClassroom controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const deleteClassroom = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Classroom ID is required"
            });
        }

        const classroom = await ClassroomModel.deleteClassroomById(id);
        
        if (!classroom) {
            return res.status(404).json({
                success: false,
                message: "Classroom not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Classroom deleted successfully",
            data: classroom
        });
    } catch (error) {
        console.error("Error in deleteClassroom controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    createClassroom,
    getAllClassroomsByDep,
    updateClassroom,
    deleteClassroom
};