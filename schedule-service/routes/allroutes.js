const router = require('express').Router();
const UIrequirementController = require('../controllers/UIrequirementController');
const sessionController = require('../controllers/sessionController');
const scheduleEntryController = require('../controllers/scheduleentryController');
const excusedAbsenceController = require('../controllers/excusedAbsenceController');
const notificationController = require('../controllers/notificationController');


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


// excusedAbsenceController routes
router.post('/excused-absence', excusedAbsenceController.createExcusedAbsence);
router.get('/excused-absence/:student_id', excusedAbsenceController.getAllExcusedAbsencesByStudent);
router.put('/excused-absence/:id', excusedAbsenceController.updateExcusedAbsence);
router.delete('/excused-absence/:id', excusedAbsenceController.deleteExcusedAbsence);

// notificationController routes
router.post('/notification', notificationController.createNotification);
router.get('/notification/:uid', notificationController.getAllNotificationsByUser);
router.put('/notification/:id', notificationController.markNotificationAsRead);
router.delete('/:id', notificationController.deleteNotification);



module.exports = router;