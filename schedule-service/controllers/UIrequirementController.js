const UIRenderCustomModel = require("../models/UIrenderCustom");



const listSubjects = async (req, res) => {
    try{
        const subjects = await UIRenderCustomModel.listSubjects();
        res.status(200).json({
            success: true,
            message: 'Subjects retrieved successfully',
            data: subjects
        });
    }catch(err){
        res.status(500).json({ error: 'Failed to retrieve subjects' });
    }
};


const listTeachersBySubject = async (req, res) => {
    try{
        const { subject_id } = req.params;
        const teachers = await UIRenderCustomModel.listTeachersBySubject(subject_id);
        res.status(200).json({
            success: true,
            message: 'Teachers retrieved successfully',
            data: teachers
        });
    }catch(err){
        res.status(500).json({ error: 'Failed to retrieve teachers' });
    }
};

const listClassrooms = async (req, res) => {
    try{
        const classrooms = await UIRenderCustomModel.listClassrooms();
        res.status(200).json({
            success: true,
            message: 'Classrooms retrieved successfully',
            data: classrooms
        });
    }catch(err){
        res.status(500).json({ error: 'Failed to retrieve classrooms' });
    }
};

const listStudentsByGroupe = async (req, res) => {
    try{
        const { groupe_id } = req.params;
        const students = await UIRenderCustomModel.getAllStudentsByGroupe(groupe_id);
        res.status(200).json({
            success: true,
            message: 'Students retrieved successfully',
            data: students
        });
    }catch(err){
        res.status(500).json({ error: 'Failed to retrieve students' });
    }
};


module.exports = {
    listSubjects,
    listTeachersBySubject,
    listClassrooms,
    listStudentsByGroupe
};