const { Speciality } = require('../models');

const createSpeciality = async (req, res) => {
    try {
        const speciality = await Speciality.create(req.body);
        res.status(201).json(speciality);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getSpecialitiesByDepId = async (req, res) => {
    try {
        const { depId } = req.params;
        const specialities = await Speciality.findOne({ departmentId: depId });
        res.status(200).json(specialities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSpecialityById = async (req, res) => {
    try {
        const { id } = req.params;
        const speciality = await Speciality.findById(id);
        if (!speciality) {
            return res.status(404).json({ message: 'Speciality not found' });
        }
        res.status(200).json(speciality);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateSpecialityById = async (req, res) => {
    try {
        const { id } = req.params;
        const speciality = await Speciality.update(id, req.body, { 
            new: true,
            runValidators: true 
        });
        if (!speciality) {
            return res.status(404).json({ message: 'Speciality not found' });
        }
        res.status(200).json(speciality);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteSpecialityById = async (req, res) => {
    try {
        const { id } = req.params;
        const speciality = await Speciality.deleteById(id);
        if (!speciality) {
            return res.status(404).json({ message: 'Speciality not found' });
        }
        res.status(200).json({ message: 'Speciality deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const SpecialitiesController = {
    createSpeciality,
    getSpecialitiesByDepId,
    getSpecialityById,
    updateSpecialityById,
    deleteSpecialityById,
};

module.exports = SpecialitiesController;