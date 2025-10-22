const { Student ,Custom_CreateNewUser } = require('../models');
const { Readable } = require('stream');
const csv = require('csv-parse');
const bycrypt = require('bcrypt');


const createStudent = async (req, res) => {
    try{
        const generatedPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bycrypt.hash(generatedPassword, 10);
        const user = await Custom_CreateNewUser(req.body.cin , req.body.name , req.body.email ,hashedPassword, 'student');
        if(!user){
            return  res.status(400).json({ message: 'Error creating user' });
        }
        req.body = {};
        req.body.uid = user.id;
        const student = await Student.create(req.body);
        delete user.password;
        delete user.reset_token;
        delete user.reset_token_expires;
        res.status(201).json({...user, ...student});
    }catch(err){
        res.status(400).json({ message: err.message });
    }
};


const getStudentById = async (req, res) => {
    try{
        const { id } = req.params;
        const student = await Student.findById(id);
        if(!student){
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(student);
    }catch(err){
        res.status(500).json({ message: err.message });
    }
};

const updateStudentById = async (req, res) => {
    try{
        const { id } = req.params;
        const student = await Student.update(id, req.body);
        if(!student){
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(student);
    }catch(err){
        res.status(400).json({ message: err.message });
    }
};

const deleteStudentById = async (req, res) => {
    try{
        const { id } = req.params;
        const student = await Student.deleteById(id);
        if(!student){
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json({ message: 'Student deleted successfully' });
    }catch(err){
        res.status(500).json({ message: err.message });
    }
};


const uploadStudentsFromCSV = async (req, res) => {
    try{
        if(!req.file){
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const results = [];
        const stream = Readable.from(req.file.buffer);

        stream
        .pipe(csv())
        .on('data', (row) => {results.push(row);})
        .on('end',()=>{
            res.status(200).json({data : results});
        })
    }catch(err){
        res.status(500).json({ message: err.message });
    }
};

const downloadStudentsAsCSV = async (req, res) => {
    try{
        const students = await Student.findAll();
        let csvData = 'id,name,email,speciality,level\n';
        students.forEach(student => {
            csvData += `${student.id},${student.name},${student.email},${student.speciality}\n`;
        });
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="students.csv"');
        res.status(200).send(csvData);
    }catch(err){
        res.status(500).json({ message: err.message });
    }
};


const StudentController ={
    createStudent,
    getStudentById,
    updateStudentById,
    deleteStudentById,
    uploadStudentsFromCSV,
    downloadStudentsAsCSV,
}

module.exports = StudentController;