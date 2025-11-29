const SpecialityModel = require("../models/SpecCustom");

const createSpeciality = async (req, res) => {
    try {
        const { code_speciality, name_speciality, departement_id } = req.body;
        
        if (!code_speciality || !name_speciality || !departement_id) {
            return res.status(400).json({
                success: false,
                message: "All fields are required: code_speciality, name_speciality, departement_id"
            });
        }

        const speciality = await SpecialityModel.createSpeciality(code_speciality, name_speciality, departement_id);
        
        res.status(201).json({
            success: true,
            message: "Speciality created successfully",
            data: speciality
        });
    } catch (error) {
        console.error("Error in createSpeciality controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getAllSpecialities = async (req, res) => {
    const {dep_id} = req.params;
    const userRole = req.userRole;
    const userDepartmentId = req.userDepartmentId;
    
    try {
        // Chef role can only access their own department
        if (userRole === 'chef' && parseInt(dep_id) !== parseInt(userDepartmentId)) {
            return res.status(403).json({
                success: false,
                message: "You can only access specialties from your own department"
            });
        }

        const specialities = await SpecialityModel.getAllSpecialities(dep_id);
        
        res.status(200).json({
            success: true,
            message: "Specialities retrieved successfully",
            data: specialities
        });
    } catch (error) {
        console.error("Error in getAllSpecialities controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const updateSpeciality = async (req, res) => {
    try {
        const { id } = req.params;
        const { code_speciality, name_speciality } = req.body;
        
        if (!id || !code_speciality || !name_speciality) {
            return res.status(400).json({
                success: false,
                message: "All fields are required: id, code_speciality, name_speciality, departement_id"
            });
        }

        const speciality = await SpecialityModel.updateSpecialityById(id, code_speciality, name_speciality);
        
        if (!speciality) {
            return res.status(404).json({
                success: false,
                message: "Speciality not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Speciality updated successfully",
            data: speciality
        });
        
    } catch (error) {
        console.error("Error in updateSpeciality controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const deleteSpeciality = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Speciality ID is required"
            });
        }

        const speciality = await SpecialityModel.deleteSpecialityById(id);
        
        if (!speciality) {
            return res.status(404).json({
                success: false,
                message: "Speciality not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Speciality deleted successfully",
            data: speciality
        });
    } catch (error) {
        console.error("Error in deleteSpeciality controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};



module.exports = {
    createSpeciality,
    getAllSpecialities,
    updateSpeciality,
    deleteSpeciality
};