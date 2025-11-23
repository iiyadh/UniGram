const router = require('express').Router();
const UIrequirementController = require('../controllers/UIrequirementController');
const sessionController = require('../controllers/sessionController');
const scheduleEntryController = require('../controllers/scheduleentryController');


// UIrequirementController routes
router.get('/subjects', UIrequirementController.listSubjects);
router.get('/teachers-subject/:subject_id', UIrequirementController.listTeachersBySubject);
router.get('/classrooms', UIrequirementController.listClassrooms);
router.get('/students-groupe/:groupe_id', UIrequirementController.listStudentsByGroupe);

// absentController routes
router.post('/absences', sessionController.createAbsence);
router.post('/submit-attendance', sessionController.submitAttendance);
router.get('/attendance/:schedule_entry_id/:date', sessionController.getExistingAttendance);
router.get('/absences-student/:student_id', sessionController.getAbsencesByStudent);


// scheduleEntryController routes
router.get('/schedule-entries-groupe/:groupe_id', scheduleEntryController.getAllScheduleEntriesForGroupe);
router.get('/schedule-entries-teacher/:teacher_id', scheduleEntryController.getAllScheduleEntriesForTeacher);
router.get('/schedule-entries-classroom/:classroom_id', scheduleEntryController.getAllScheduleEntriesForClassroom);
router.post('/schedule-entries', scheduleEntryController.createScheduleEntry);
router.put('/schedule-entries/:id', scheduleEntryController.updateScheduleEntry);
router.delete('/schedule-entries/:id', scheduleEntryController.deleteScheduleEntry);


router.get('/', (req, res) => {
    res.send('Schedule Service is running');
});






module.exports = router;