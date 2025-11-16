const DepartementModel = require("../models/DepCustom");

const createDepartment = async (req, res) => {
    try {
        const { name } = req.body;
        
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Department name is required"
            });
        }

        const department = await DepartementModel.createDep(name);
        
        res.status(201).json({
            success: true,
            message: "Department created successfully",
            data: department
        });
    } catch (error) {
        console.error("Error in createDepartment controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getAllDepartments = async (req, res) => {
    try {
        const departments = await DepartementModel.getAllDeps();
        
        res.status(200).json({
            success: true,
            message: "Departments retrieved successfully",
            data: departments
        });
    } catch (error) {
        console.error("Error in getAllDepartments controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getTeachers = async (req, res) => {
    try {
        const teachers = await DepartementModel.listTeachers();
        
        res.status(200).json({
            success: true,
            message: "Teachers retrieved successfully",
            data: teachers
        });
    } catch (error) {
        console.error("Error in getTeachers controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, chef_id } = req.body;
        
        if (!id || !name) {
            return res.status(400).json({
                success: false,
                message: "Department ID and name are required"
            });
        }

        const department = await DepartementModel.updateDepbyId(id, name, chef_id);
        
        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Department updated successfully",
            data: department
        });
    } catch (error) {
        console.error("Error in updateDepartment controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Department ID is required"
            });
        }

        const department = await DepartementModel.deleteDepbyId(id);
        
        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Department deleted successfully",
            data: department
        });
    } catch (error) {
        console.error("Error in deleteDepartment controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    createDepartment,
    getAllDepartments,
    getTeachers,
    updateDepartment,
    deleteDepartment
};