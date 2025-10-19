
const createSubject = async (req, res) => {
    // Implementation for creating a departement
};

const getSubjectsByLevelId = async (req, res) => {
    // Implementation for retrieving departements
};

const getSubjectById = async (req, res) => {
    // Implementation for retrieving a departement by ID
};

const updateSubjectById = async (req, res) => {
    // Implementation for updating a departement
};

const deleteSubjectById = async (req, res) => {
    // Implementation for deleting a departement
};

const SubjectController = {
    createSubject,
    getSubjectsByLevelId, 
    getSubjectById,
    updateSubjectById,
    deleteSubjectById,
};

module.exports = SubjectController;