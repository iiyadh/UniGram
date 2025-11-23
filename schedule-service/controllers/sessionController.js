const SessionModel = require("../models/sessionCustom");
const pool = require("../lib/db");



const createAbsence = async (req, res) => {
    try{
        const { students , schedule_entry_id } = req.body;
        const currentDate = new Date().toISOString().split('T')[0];
        
        for (const student_id of students) {
            await SessionModel.createSession(student_id, schedule_entry_id, 'Absent', currentDate);
        }
        
        res.status(201).json({
            success: true,
            message: 'Absence recorded successfully',
        });
    }catch(err){
        console.error('Error in createAbsence:', err);
        res.status(500).json({ error: 'Failed to record absence' });
    }
};

const submitAttendance = async (req, res) => {
    try{
        const { students, schedule_entry_id } = req.body;
        const currentDate = new Date().toISOString().split('T')[0];
        await pool.query(
            `DELETE FROM sessions WHERE schedule_entry_id = $1 AND date = $2`,
            [schedule_entry_id, currentDate]
        );
        let recordedCount = 0;
        for (const student of students) {
            await SessionModel.createSession(
                student.student_id, 
                schedule_entry_id, 
                student.status, 
                currentDate
            );
            recordedCount++;
        }
        
        const absentCount = students.filter(s => s.status === 'Absent' || s.status === 'Excused').length;
        
        res.status(201).json({
            success: true,
            message: 'Attendance submitted successfully',
            total_students: recordedCount,
            recorded_absences: absentCount
        });
    }catch(err){
        console.error('Error in submitAttendance:', err);
        res.status(500).json({ error: 'Failed to submit attendance' });
    }
};


const getAbsencesByStudent = async (req, res) => {
    try{
        const { student_id } = req.params;
        const absences = await SessionModel.getSessionsByStudent(student_id);
        res.status(200).json({
            success: true,
            message: 'Absences retrieved successfully',
            data: absences
        });
    }catch(err){
        res.status(500).json({ error: 'Failed to retrieve absences' });
    }
};

const getExistingAttendance = async (req, res) => {
    try{
        const { schedule_entry_id, date } = req.params;
        const attendance = await SessionModel.getExistingAttendance(schedule_entry_id, date);
        res.status(200).json({
            success: true,
            message: 'Existing attendance retrieved successfully',
            data: attendance
        });
    }catch(err){
        console.error('Error in getExistingAttendance:', err);
        res.status(500).json({ error: 'Failed to retrieve existing attendance' });
    }
};



module.exports = {
    createAbsence,
    submitAttendance,
    getAbsencesByStudent,
    getExistingAttendance
};