const { Subject } = require('../models');

const createSubject = async (req, res) => {
    try{
        const subject = await Subject.create(req.body);
        res.status(201).json(subject);
    }catch(err){
        res.status(400).json({ message: err.message });
    }
};

const getSubjectsByLevelId = async (req, res) => {
    try{
        const { levelId } = req.params;
        const subjects = await Subject.findAll({ levelId: levelId });
        res.status(200).json(subjects);
    }catch(err){
        res.status(500).json({ message: err.message });
    }
};

const getSubjectById = async (req, res) => {
    try{
        const { id } = req.params;
        const subject = await Subject.findById(id);
        if(!subject){
            return  res.status(404).json({ message: 'Subject not found' });
        }
        res.status(200).json(subject);
    }catch(err){
        res.status(500).json({ message: err.message });
    }
};

const updateSubjectById = async (req, res) => {
    try{
        const { id } = req.params;
        const subject = await Subject.update(id, req.body);
        if(!subject){
            return res.status(404).json({ message: 'Subject not found' });
        }
        res.status(200).json(subject);
    }catch(err){
        res.status(400).json({ message: err.message });
    }
};

const deleteSubjectById = async (req, res) => {
    try{
        const { id } = req.params;
        const subject = await Subject.deleteById(id);
        if(!subject){
            return res.status(404).json({ message: 'Subject not found' });
        }
        res.status(200).json({ message: 'Subject deleted successfully' });
    }catch(err){
        res.status(500).json({ message: err.message });
    }
};

const SubjectController = {
    createSubject,
    getSubjectsByLevelId, 
    getSubjectById,
    updateSubjectById,
    deleteSubjectById,
};

module.exports = SubjectController;