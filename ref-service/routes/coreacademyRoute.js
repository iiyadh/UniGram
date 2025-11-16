const router = require('express').Router();
const upload = require('../lib/multerConfig');

const departmentController = require('../controllers/departmentController');
const specialtyController = require('../controllers/specialtyController');
const levelController = require('../controllers/levelController');
const groupController = require('../controllers/groupController');
const subjectController = require('../controllers/subjectController');
const classroomController = require('../controllers/classroomController');


// Department Routes
router.post('/departments', departmentController.createDepartment);
router.get('/departments', departmentController.getAllDepartments);
router.get('/departments/teachers', departmentController.getTeachers);
router.put('/departments/:id', departmentController.updateDepartment);
router.delete('/departments/:id', departmentController.deleteDepartment);

// Specialty Routes
router.post('/specialties', specialtyController.createSpeciality);
router.get('/specialties/:dep_id', specialtyController.getAllSpecialities);
router.put('/specialties/:id', specialtyController.updateSpeciality);
router.delete('/specialties/:id', specialtyController.deleteSpeciality);

// Level Routes
router.post('/levels', levelController.createLevel);
router.get('/levels/:speciality_id', levelController.getLevelsBySpeciality);
router.delete('/levels/:id', levelController.deleteLevel);


// Group Routes
router.post('/groups', groupController.createGroup);
router.get('/groups/:id_level', groupController.getAllGroupsByLevel);
router.put('/groups/:id', groupController.updateGroup);
router.delete('/groups/:id', groupController.deleteGroup);


// Subject Routes
router.post('/subjects', subjectController.createSubject);
router.get('/subjects/:id_level', subjectController.getAllSubjectsByLevel);
router.put('/subjects/:id', subjectController.updateSubject);
router.delete('/subjects/:id', subjectController.deleteSubject);

// ClassRoom Routes
router.post('/classrooms', classroomController.createClassroom);
router.get('/classrooms/:id_departement', classroomController.getAllClassroomsByDep);
router.put('/classrooms/:id', classroomController.updateClassroom);
router.delete('/classrooms/:id', classroomController.deleteClassroom);




module.exports = router;