const StudentModel = require("../models/StudentCustom");


const importStudentsCsv = async (req, res) => {
    try{
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }
        const fileBuffer = req.file.buffer;
        const fileContent = fileBuffer.toString('utf-8');
        const lines = fileContent.split('\n').slice(1);
        for (const line of lines) {
            const [cin, name, email] = line.split(',');
            if (cin && name && email) {
                await StudentModel.createStudent(cin.trim(), name.trim(), email.trim());
            }
        }
        res.status(200).json({
            success: true,
            message: "Students imported successfully"
        });
    }catch(err){
        console.log(err);
    }
};

const exportStudentsCsv = async (req, res) => {
    try{
        const data = await StudentModel.getAllStudents();
        let csvData = "CIN,Name,Email\n";
        data.forEach(student => {
            csvData += `${student.cin},${student.name},${student.email}\n`;
        });
        res.setHeader('Content-Disposition', 'attachment; filename=students.csv');
        res.setHeader('Content-Type', 'text/csv');
        res.status(200).send(csvData);
    }catch(err){
        console.log(err);
    }
};

const createStudent = async (req, res) => {
    try {
        const { cin, name, email } = req.body;
        
        if (!cin || !name || !email) {
            return res.status(400).json({
                success: false,
                message: "CIN, name, and email are required"
            });
        }

        const result = await StudentModel.createStudent(cin, name, email);
        
        if (!result) {
            return res.status(500).json({
                success: false,
                message: "Failed to create student"
            });
        }

        res.status(201).json({
            success: true,
            message: "Student created successfully",
            data: result
        });
    } catch (error) {
        console.error("Error in createStudent controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getAllStudents = async (req, res) => {
    try {
        const students = await StudentModel.getAllStudents();
        
        res.status(200).json({
            success: true,
            message: "Students retrieved successfully",
            data: students
        });
    } catch (error) {
        console.error("Error in getAllStudents controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const updateStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { cin, name, email , account_status , group_id } = req.body;
        console.log(req.body);
        
        if (!studentId || !cin || !name || !email || !account_status) {
            return res.status(400).json({
                success: false,
                message: "Student ID, CIN, name, email are required"
            });
        }

        const result = await StudentModel.updateStudent(studentId, cin, name, email , account_status , group_id);
        
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Student not found or update failed"
            });
        }
        console.log(result);

        res.status(200).json({
            success: true,
            message: "Student updated successfully",
            data: result
        });
    } catch (error) {
        console.error("Error in updateStudent controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const deleteStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        
        if (!studentId) {
            return res.status(400).json({
                success: false,
                message: "Student ID is required"
            });
        }

        const result = await StudentModel.deleteStudent(studentId);
        
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Student not found or deletion failed"
            });
        }

        res.status(200).json({
            success: true,
            message: "Student deleted successfully",
            data: result
        });
    } catch (error) {
        console.error("Error in deleteStudent controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


const listAllGroups = async (req, res) => {
    try {
        const groups = await StudentModel.listAllGroups();
        res.status(200).json({
            success: true,
            message: "Groups retrieved successfully",
            data: groups
        });
    } catch (error) {
        console.error("Error in listAllGroups controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    createStudent,
    getAllStudents,
    updateStudent,
    deleteStudent,
    importStudentsCsv,
    exportStudentsCsv,
    listAllGroups
};