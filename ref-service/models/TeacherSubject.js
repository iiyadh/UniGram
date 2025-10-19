const BaseModel = require('./_base');

class TeacherSubject extends BaseModel {}

TeacherSubject.table = 'teacher_subjects';
TeacherSubject.columns = ['teacher_id', 'subject_id'];
TeacherSubject.pk = ['teacher_id', 'subject_id'];

module.exports = TeacherSubject;
