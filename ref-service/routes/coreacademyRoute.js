const router = require('express').Router();
const upload = require('../lib/multerConfig');

const DepartementController = require('../controllers/departementController');
const SpecialitiesController = require('../controllers/specialityController');
const LevelController = require('../controllers/levelController');
const SubjectController = require('../controllers/subjectController');
const StudentController = require('../controllers/studentController');

router.post('/departements', DepartementController.createDepartement);
router.get('/departements', DepartementController.getDepartements);
router.get('/departements/:id', DepartementController.getDepartementById);
router.put('/departements/:id', DepartementController.updateDepartementById);
router.delete('/departements/:id', DepartementController.deleteDepartementById);


router.post('/specialities', SpecialitiesController.createSpeciality);
router.get('/specialities/department/:depId', SpecialitiesController.getSpecialitiesByDepId);
router.get('/specialities/:id', SpecialitiesController.getSpecialityById);
router.put('/specialities/:id', SpecialitiesController.updateSpecialityById);
router.delete('/specialities/:id', SpecialitiesController.deleteSpecialityById);


router.post('/levels', LevelController.createLevel);
router.get('/levels/speciality/:specId', LevelController.getLevelsBySpecId);
router.get('/levels/:id', LevelController.getLevelById);
router.put('/levels/:id', LevelController.updateLevelById);
router.delete('/levels/:id', LevelController.deleteLevelById);



router.post('/subjects', SubjectController.createSubject);
router.get('/subjects/level/:levelId', SubjectController.getSubjectsByLevelId);
router.get('/subjects/:id', SubjectController.getSubjectById);
router.put('/subjects/:id', SubjectController.updateSubjectById);
router.delete('/subjects/:id', SubjectController.deleteSubjectById);

router.post('/students/upload', upload.single('file'),StudentController.uploadStudentsFromCSV );
router.get('/students/download', StudentController.downloadStudentsAsCSV );
router.post('/students', StudentController.createStudent);
router.get('/students/:id', StudentController.getStudentById);
router.put('/students/:id', StudentController.updateStudentById);
router.delete('/students/:id', StudentController.deleteStudentById);




module.exports = router;