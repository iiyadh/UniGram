const ScheduleEntryModel = require('../models/scheduleentryCustom');

const createScheduleEntry = async (req, res) => {
    try {
        const { subjectId, teacherId, classroomId, groupeId, day, timeSlots } = req.body;

        if (!subjectId || !teacherId || !classroomId || !groupeId || !day || !timeSlots) {
            return res.status(400).json({ 
                success: false,
                error: 'All fields are required' 
            });
        }

        const scheduleEntries = await Promise.all(
            timeSlots.map(async (timeSlot) => {
                return await ScheduleEntryModel.createScheduleEntry(
                    subjectId,
                    teacherId,
                    classroomId,
                    groupeId,
                    day,
                    timeSlot
                );
            })
        );

        res.status(201).json({
            success: true,
            message: 'Schedule entries created successfully',
            data: scheduleEntries
        });
    } catch (err) {
        console.error('Error creating schedule entry:', err);
        res.status(500).json({ 
            success: false,
            error: 'Failed to create schedule entry' 
        });
    }
};

const getAllScheduleEntriesForGroupe = async (req, res) => {
    try {
        const { groupe_id } = req.params;
        const scheduleEntries = await ScheduleEntryModel.getAllScheduleEntriesForGroupe(groupe_id);
        res.status(200).json({
            success: true,
            message: 'Schedule entries retrieved successfully',
            data: scheduleEntries
        });
    } catch (err) {
        console.error('Error retrieving schedule entries:', err);
        res.status(500).json({ 
            success: false,
            error: 'Failed to retrieve schedule entries' 
        });
    }
};

const getAllScheduleEntriesForTeacher = async (req, res) => {
    try {
        const { teacher_id } = req.params;
        const scheduleEntries = await ScheduleEntryModel.getAllScheduleEntriesForTeacher(teacher_id);
        res.status(200).json({
            success: true,
            message: 'Schedule entries for teacher retrieved successfully',
            data: scheduleEntries
        });
    } catch (err) {
        console.error('Error retrieving teacher schedule entries:', err);
        res.status(500).json({ 
            success: false,
            error: 'Failed to retrieve schedule entries for teacher' 
        });
    }
};

const getAllScheduleEntriesForClassroom = async (req, res) => {
    try {
        const { classroom_id } = req.params;
        console.log("Fetching schedule entries for classroom ID:", classroom_id);
        const scheduleEntries = await ScheduleEntryModel.getAllScheduleEntriesForClassroom(classroom_id);
        res.status(200).json({
            success: true,
            message: 'Schedule entries for classroom retrieved successfully',
            data: scheduleEntries
        });
    } catch (err) {
        console.error('Error retrieving classroom schedule entries:', err);
        res.status(500).json({ 
            success: false,
            error: 'Failed to retrieve schedule entries for classroom' 
        });
    }
};

const updateScheduleEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const { subjectId, teacherId, classroomId, groupeId, day, timeSlot } = req.body;

        if (!subjectId || !teacherId || !classroomId || !groupeId || !day || !timeSlot) {
            return res.status(400).json({ 
                success: false,
                error: 'All fields are required' 
            });
        }

        const updatedEntry = await ScheduleEntryModel.updateScheduleEntry(
            id,
            subjectId,
            teacherId,
            classroomId,
            groupeId,
            day,
            timeSlot
        );

        if (!updatedEntry) {
            return res.status(404).json({
                success: false,
                error: 'Schedule entry not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Schedule entry updated successfully',
            data: updatedEntry
        });
    } catch (err) {
        console.error('Error updating schedule entry:', err);
        res.status(500).json({ 
            success: false,
            error: 'Failed to update schedule entry' 
        });
    }
};

const deleteScheduleEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEntry = await ScheduleEntryModel.deleteScheduleEntry(id);

        if (!deletedEntry) {
            return res.status(404).json({
                success: false,
                error: 'Schedule entry not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Schedule entry deleted successfully',
            data: deletedEntry
        });
    } catch (err) {
        console.error('Error deleting schedule entry:', err);
        res.status(500).json({ 
            success: false,
            error: 'Failed to delete schedule entry' 
        });
    }
};

module.exports = {
    createScheduleEntry,
    getAllScheduleEntriesForGroupe,
    getAllScheduleEntriesForTeacher,
    getAllScheduleEntriesForClassroom,
    updateScheduleEntry,
    deleteScheduleEntry
};