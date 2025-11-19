const TeacherModel = require("../models/TeacherCustom");

const createTeacher = async (req, res) => {
    try {
        const { cin, name, email } = req.body;

        console.log(req.body);
        
        if (!cin || !name || !email) {
            return res.status(400).json({
                success: false,
                message: "CIN, name, and email are required"
            });
        }

        const result = await TeacherModel.createTeacher(cin, name, email);
        
        if (!result) {
            return res.status(500).json({
                success: false,
                message: "Failed to create teacher"
            });
        }

        res.status(201).json({
            success: true,
            message: "Teacher created successfully",
            data: result
        });
    } catch (error) {
        console.error("Error in createTeacher controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getAllTeachers = async (req, res) => {
    try {
        const teachers = await TeacherModel.getAllTeachers();
        
        res.status(200).json({
            success: true,
            message: "Teachers retrieved successfully",
            data: teachers
        });
    } catch (error) {
        console.error("Error in getAllTeachers controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const listAllSubjects = async (req, res) => {
    try {
        const subjects = await TeacherModel.listAllSubjects();
        res.status(200).json({
            success: true,
            message: "Subjects retrieved successfully",
            data: subjects
        });
    } catch (error) {
        console.error("Error in listAllSubjects controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const updateTeacher = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const { cin, name, email, account_status } = req.body;
        
        if (!teacherId || !cin || !name || !email) {
            return res.status(400).json({
                success: false,
                message: "Teacher ID, CIN, name, and email are required"
            });
        }

        const result = await TeacherModel.updateTeacher(teacherId, cin, name, email, account_status || 'Active');
        
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found or update failed"
            });
        }

        res.status(200).json({
            success: true,
            message: "Teacher updated successfully",
            data: result
        });
    } catch (error) {
        console.error("Error in updateTeacher controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const deleteTeacher = async (req, res) => {
    try {
        const { teacherId } = req.params;
        
        if (!teacherId) {
            return res.status(400).json({
                success: false,
                message: "Teacher ID is required"
            });
        }

        const result = await TeacherModel.deleteTeacher(teacherId);
        
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found or deletion failed"
            });
        }

        res.status(200).json({
            success: true,
            message: "Teacher deleted successfully",
            data: result
        });
    } catch (error) {
        console.error("Error in deleteTeacher controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const addSubjectsToTeacher = async (req, res) => {
    try{
        const { teacherId } = req.params;
        const { subjects } = req.body;

        if(!teacherId || !subjects || !Array.isArray(subjects)){
            return res.status(400).json({
                success: false,
                message: "Teacher ID and subjects array are required"
            });
        }

        if(subjects.length === 0){
            return res.status(400).json({
                success: false,
                message: "At least one subject ID is required"
            });
        }

        // Use Promise.all to handle all subjects at once
        const results = await Promise.all(
            subjects.map(subjectId => 
                TeacherModel.addSubjectsToTeacher(teacherId, subjectId)
            )
        );

        res.status(200).json({
            success: true,
            message: "Subjects added to teacher successfully",
            data: results.filter(result => result !== undefined) // Filter out duplicates
        });
    }catch(err){
        console.error("Error in addSubjectsToTeacher controller:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

const deleteSubjectsFromTeacher = async (req, res) => {
    try{
        const { teacherId , subjectId } = req.params;
        
        if(!teacherId || !subjectId){
            return res.status(400).json({
                success: false,
                message: "Teacher ID and subject ID are required"
            });
        }
        
        const result = await TeacherModel.deleteSubjectsFromTeacher(teacherId , subjectId);
        
        res.status(200).json({
            success: true,
            message: "Subject removed from teacher successfully",
            data: result
        });
    }catch(err){
        console.error("Error in deleteSubjectsFromTeacher controller:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const listSubjectByTeacher = async (req, res) =>{
    try{
        const { teacherId } = req.params;
        
        if(!teacherId){
            return res.status(400).json({
                success: false,
                message: "Teacher ID is required"
            });
        }
        
        const subjects = await TeacherModel.listSubjectByTeacher(teacherId);
        
        res.status(200).json({
            success: true,
            message: "Subjects retrieved successfully",
            data: subjects || []
        });
    }catch(err){
        console.error("Error in listSubjectByTeacher controller:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

module.exports = {
    createTeacher,
    getAllTeachers,
    listAllSubjects,
    updateTeacher,
    deleteTeacher,
    addSubjectsToTeacher,
    deleteSubjectsFromTeacher,
    listSubjectByTeacher,
};