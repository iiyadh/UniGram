const ExcusedAbsenceModel = require('../models/excusedAbsenceCustom');

const createExcusedAbsence = async (req, res) => {
    try {
        const { student_id, schedule_entry_id, reason, date } = req.body;

        if (!student_id || !schedule_entry_id || !reason) {
            return res.status(400).json({ success: false, error: 'All required fields must be provided' });
        }

        const newAbsence = await ExcusedAbsenceModel.createExcusedAbsence(student_id, schedule_entry_id, reason, date);
        res.status(201).json({ success: true, data: newAbsence });
    } catch (err) {
        console.error('Error creating excused absence:', err);
        res.status(500).json({ success: false, error: 'Failed to create excused absence' });
    }
};

const getAllExcusedAbsencesByStudent = async (req, res) => {
    try {
        const { student_id } = req.params;
        const absences = await ExcusedAbsenceModel.getAllExcusedAbsencesByStudent(student_id);
        res.status(200).json({ success: true, data: absences });
    } catch (err) {
        console.error('Error retrieving excused absences:', err);
        res.status(500).json({ success: false, error: 'Failed to retrieve excused absences' });
    }
};

const updateExcusedAbsence = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason, date } = req.body;

        const updated = await ExcusedAbsenceModel.updateExcusedAbsence(id, reason, date);
        if (!updated) return res.status(404).json({ success: false, error: 'Absence not found' });

        res.status(200).json({ success: true, data: updated });
    } catch (err) {
        console.error('Error updating excused absence:', err);
        res.status(500).json({ success: false, error: 'Failed to update excused absence' });
    }
};

const deleteExcusedAbsence = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await ExcusedAbsenceModel.deleteExcusedAbsence(id);
        if (!deleted) return res.status(404).json({ success: false, error: 'Absence not found' });

        res.status(200).json({ success: true, data: deleted });
    } catch (err) {
        console.error('Error deleting excused absence:', err);
        res.status(500).json({ success: false, error: 'Failed to delete excused absence' });
    }
};

module.exports = {
    createExcusedAbsence,
    getAllExcusedAbsencesByStudent,
    updateExcusedAbsence,
    deleteExcusedAbsence
};
